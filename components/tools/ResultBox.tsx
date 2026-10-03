import type { ReactNode } from "react";

/** Encadré de résultat principal d'un calculateur */
export function ResultBox({ label, value, children }: { label: string; value: ReactNode; children?: ReactNode }) {
  return (
    <div aria-live="polite" className="rounded-2xl bg-gradient-to-br from-eau-700 to-turquoise-600 p-6 text-white">
      <p className="text-sm font-medium text-eau-50">{label}</p>
      <p className="mt-1 text-4xl font-bold">{value}</p>
      {children && <div className="mt-3 text-sm text-eau-50">{children}</div>}
    </div>
  );
}
