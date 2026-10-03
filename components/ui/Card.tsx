import type { ReactNode } from "react";
import { cn } from "./cn";

/** Carte arrondie avec bordure douce */
export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("rounded-2xl border border-eau-100 bg-white p-5 shadow-sm sm:p-6", className)}>
      {children}
    </div>
  );
}
