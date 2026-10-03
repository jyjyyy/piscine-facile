import type { ReactNode } from "react";
import { cn } from "./cn";

type Tone = "neutral" | "good" | "warning" | "critical" | "info";

const styles: Record<Tone, string> = {
  neutral: "bg-slate-100 text-slate-800",
  good: "bg-emerald-100 text-emerald-900",
  warning: "bg-amber-100 text-amber-900",
  critical: "bg-red-100 text-red-900",
  info: "bg-eau-100 text-eau-900",
};

/** Petite étiquette de statut */
export function Badge({ tone = "neutral", children }: { tone?: Tone; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", styles[tone])}>
      {children}
    </span>
  );
}
