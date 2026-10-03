import type { ReactNode } from "react";
import { CircleAlert, CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "./cn";

type Tone = "info" | "success" | "warning" | "danger";

const styles: Record<Tone, string> = {
  info: "border-eau-200 bg-eau-50 text-eau-950",
  success: "border-emerald-200 bg-emerald-50 text-emerald-950",
  warning: "border-amber-300 bg-amber-50 text-amber-950",
  danger: "border-red-300 bg-red-50 text-red-950",
};

const icons: Record<Tone, typeof Info> = {
  info: Info,
  success: CircleCheck,
  warning: TriangleAlert,
  danger: CircleAlert,
};

/** Encadré d'information coloré */
export function Alert({
  tone = "info",
  title,
  children,
  className,
}: {
  tone?: Tone;
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  const Icon = icons[tone];
  return (
    <div className={cn("flex gap-3 rounded-2xl border p-4", styles[tone], className)}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" aria-hidden="true" />
      <div className="text-sm leading-relaxed">
        {title && <p className="mb-1 font-semibold">{title}</p>}
        {children}
      </div>
    </div>
  );
}
