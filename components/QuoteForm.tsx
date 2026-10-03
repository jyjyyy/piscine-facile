"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { CircleCheck, LoaderCircle, Send } from "lucide-react";
import { Input, Select, Textarea } from "@/components/ui/Field";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { isQuoteNeed, QUOTE_NEEDS, validateQuote, type QuoteErrors } from "@/lib/quote";

type Status = "idle" | "sending" | "success" | "error";

/** Formulaire de demande de devis */
export function QuoteForm({ initialNeed = "" }: { initialNeed?: string }) {
  const [values, setValues] = useState({
    name: "",
    email: "",
    phone: "",
    postalCode: "",
    need: isQuoteNeed(initialNeed) ? initialNeed : "",
    description: "",
    consent: false,
    website: "", // champ piège anti-spam
  });
  const [errors, setErrors] = useState<QuoteErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  const set = (k: keyof typeof values) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setValues((v) => ({ ...v, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const errs = validateQuote(values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      setStatus("idle");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/devis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const json = (await res.json()) as { ok: boolean; message?: string; errors?: QuoteErrors };
      if (res.ok && json.ok) {
        setStatus("success");
      } else {
        if (json.errors) setErrors(json.errors);
        setMessage(json.message ?? "Certaines informations sont à vérifier.");
        setStatus("error");
      }
    } catch {
      setMessage("Impossible de contacter le serveur. Vérifiez votre connexion et réessayez.");
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-emerald-950">
        <p className="flex items-center gap-2 text-lg font-semibold">
          <CircleCheck className="h-6 w-6" aria-hidden="true" /> Demande envoyée, merci !
        </p>
        <p className="mt-2">
          Votre demande a bien été transmise. Un professionnel vous recontactera par téléphone ou par e-mail dans les
          meilleurs délais.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-5">
      {status === "error" && (
        <Alert tone="danger" title="La demande n'a pas pu être envoyée">
          {message}
        </Alert>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Input id="q-name" name="name" label="Nom" autoComplete="name" required value={values.name} onChange={set("name")} error={errors.name} />
        <Input id="q-email" name="email" label="E-mail" type="email" autoComplete="email" required value={values.email} onChange={set("email")} error={errors.email} />
        <Input id="q-phone" name="phone" label="Téléphone" type="tel" autoComplete="tel" required value={values.phone} onChange={set("phone")} error={errors.phone} />
        <Input id="q-postal" name="postalCode" label="Code postal" inputMode="numeric" autoComplete="postal-code" maxLength={5} required value={values.postalCode} onChange={set("postalCode")} error={errors.postalCode} />
      </div>
      <Select
        id="q-need"
        name="need"
        label="Type de besoin"
        required
        value={values.need}
        onChange={set("need")}
        error={errors.need}
        options={[{ value: "", label: "Choisissez…" }, ...QUOTE_NEEDS]}
      />
      <Textarea
        id="q-desc"
        name="description"
        label="Description de votre besoin"
        required
        value={values.description}
        onChange={set("description")}
        error={errors.description}
        hint="Type de piscine, dimensions, équipements, symptômes observés…"
      />

      {/* Champ piège : masqué aux humains, rempli par les robots */}
      <div aria-hidden="true" className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden">
        <label htmlFor="q-website">Ne pas remplir</label>
        <input id="q-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={set("website")} />
      </div>

      <div>
        <label className="flex items-start gap-3 text-sm text-slate-800">
          <input
            type="checkbox"
            name="consent"
            className="mt-0.5 h-5 w-5 shrink-0 accent-eau-700"
            checked={values.consent}
            onChange={(e) => setValues((v) => ({ ...v, consent: e.target.checked }))}
            aria-invalid={errors.consent ? true : undefined}
            aria-describedby={errors.consent ? "q-consent-error" : undefined}
          />
          <span>
            J&apos;accepte que mes données soient utilisées pour traiter ma demande et transmises à un ou plusieurs
            professionnels susceptibles d&apos;y répondre. Voir la{" "}
            <Link href="/confidentialite" className="font-medium text-eau-700 underline">
              politique de confidentialité
            </Link>
            . <span className="text-red-700">*</span>
          </span>
        </label>
        {errors.consent && (
          <p id="q-consent-error" role="alert" className="mt-1 text-xs font-medium text-red-700">
            {errors.consent}
          </p>
        )}
      </div>

      <Button type="submit" size="lg" disabled={status === "sending"} className="w-full sm:w-auto">
        {status === "sending" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <Send className="h-5 w-5" aria-hidden="true" />}
        {status === "sending" ? "Envoi en cours…" : "Envoyer ma demande"}
      </Button>
      <p className="text-xs text-slate-600">Gratuit et sans engagement. Les champs marqués d&apos;un * sont obligatoires.</p>
    </form>
  );
}

/** Variante qui lit le type de besoin dans l'URL (?besoin=electricite) */
export function QuoteFormFromUrl() {
  const params = useSearchParams();
  const need = params.get("besoin") ?? "";
  // La clé force la réinitialisation si le paramètre change
  return <QuoteForm key={need} initialNeed={need} />;
}
