/**
 * Gestion du consentement cookies (RGPD / CNIL).
 *
 * - Aucun cookie ou traceur non essentiel ne doit être déposé avant consentement.
 * - Le choix est conservé 6 mois (recommandation CNIL), puis redemandé.
 * - Le choix est stocké dans le localStorage du navigateur (stockage strictement nécessaire
 *   pour mémoriser la décision de l'utilisateur, exempté de consentement).
 */

export interface ConsentState {
  /** Mesure d'audience (ex : Google Analytics, Matomo non exempté…) */
  analytics: boolean;
  /** Publicité personnalisée */
  ads: boolean;
  /** Date du choix (timestamp ms) */
  date: number;
}

const STORAGE_KEY = "pf-consent-v1";
const MAX_AGE_MS = 1000 * 60 * 60 * 24 * 182; // ≈ 6 mois
const EVENT_NAME = "pf-consent-change";
const OPEN_EVENT = "pf-consent-open";

/** Lit le consentement enregistré (null si aucun choix valide) */
export function readConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as ConsentState;
    if (typeof parsed.date !== "number" || Date.now() - parsed.date > MAX_AGE_MS) return null;
    return parsed;
  } catch {
    return null;
  }
}

// Cache pour useSyncExternalStore (doit renvoyer la même référence tant que rien ne change)
let cachedRaw: string | null | undefined;
let cachedValue: ConsentState | null = null;

/** Instantané du consentement pour useSyncExternalStore */
export function getConsentSnapshot(): ConsentState | null {
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(STORAGE_KEY);
  } catch {
    raw = null;
  }
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedValue = readConsent();
  }
  return cachedValue;
}

/** Enregistre le choix de l'utilisateur */
export function saveConsent(choice: Omit<ConsentState, "date">): void {
  const value: ConsentState = { ...choice, date: Date.now() };
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Stockage indisponible (navigation privée stricte) : le choix vaut pour la session en cours.
  }
  window.dispatchEvent(new Event(EVENT_NAME));
}

/** Abonnement aux changements de consentement */
export function subscribeConsent(callback: () => void): () => void {
  window.addEventListener(EVENT_NAME, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT_NAME, callback);
    window.removeEventListener("storage", callback);
  };
}

/** Demande la réouverture du panneau de préférences (lien "Gérer les cookies") */
export function requestConsentPanel(): void {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function subscribeOpenPanel(callback: () => void): () => void {
  window.addEventListener(OPEN_EVENT, callback);
  return () => window.removeEventListener(OPEN_EVENT, callback);
}
