"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { BellRing, CircleCheck, LoaderCircle } from "lucide-react";
import { cn } from "@/components/ui/cn";

/** Formulaire d'inscription aux rappels d'entretien (double opt-in) */
export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [message, setMessage] = useState("");

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim())) {
      setMessage("Adresse e-mail invalide.");
      setStatus("error");
      return;
    }
    if (!consent) {
      setMessage("Cochez la case pour accepter de recevoir les rappels.");
      setStatus("error");
      return;
    }
    setStatus("sending");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, consent, website }),
      });
      const json = (await res.json()) as { ok: boolean; message?: string };
      if (res.ok && json.ok) setStatus("sent");
      else {
        setMessage(json.message ?? "L'inscription a échoué.");
        setStatus("error");
      }
    } catch {
      setMessage("Impossible de contacter le serveur.");
      setStatus("error");
    }
  };

  const text = dark ? "text-eau-50" : "text-slate-700";

  if (status === "sent") {
    return (
      <p role="status" className={cn("flex items-start gap-2 font-medium", dark ? "text-white" : "text-emerald-900")}>
        <CircleCheck className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
        Presque fini ! Cliquez sur le lien de confirmation que nous venons de vous envoyer par e-mail.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <label htmlFor={dark ? "nl-email-dark" : "nl-email"} className="sr-only">
          Adresse e-mail
        </label>
        <input
          id={dark ? "nl-email-dark" : "nl-email"}
          type="email"
          autoComplete="email"
          placeholder="votre@email.fr"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-base text-slate-900 focus:border-eau-500 focus:outline-none focus:ring-2 focus:ring-eau-200"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-turquoise-600 px-5 py-3 font-semibold text-white hover:bg-turquoise-700 disabled:opacity-60"
        >
          {status === "sending" ? <LoaderCircle className="h-5 w-5 animate-spin" aria-hidden="true" /> : <BellRing className="h-5 w-5" aria-hidden="true" />}
          Recevoir les rappels
        </button>
      </div>
      <div aria-hidden="true" className="absolute left-[-10000px] h-px w-px overflow-hidden">
        <input tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
      </div>
      <label className={cn("flex items-start gap-2 text-xs", text)}>
        <input type="checkbox" className="mt-0.5 h-4 w-4 shrink-0 accent-turquoise-600" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
        <span>
          J&apos;accepte de recevoir les rappels d&apos;entretien par e-mail (4 à 6 par an). Désinscription en un clic à tout moment.{" "}
          <Link href="/confidentialite" className="underline">
            Confidentialité
          </Link>
        </span>
      </label>
      {status === "error" && (
        <p role="alert" className={cn("text-sm font-medium", dark ? "text-amber-200" : "text-red-700")}>
          {message}
        </p>
      )}
    </form>
  );
}
