import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "./cn";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "white";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-60";

const variants: Record<Variant, string> = {
  primary: "bg-eau-700 text-white hover:bg-eau-800",
  secondary: "bg-turquoise-600 text-white hover:bg-turquoise-700",
  outline: "border-2 border-eau-200 bg-white text-eau-800 hover:border-eau-400 hover:bg-eau-50",
  ghost: "text-eau-800 hover:bg-eau-50",
  /** Bouton blanc, pour les fonds colorés */
  white: "bg-white text-eau-800 hover:bg-eau-50",
};

const sizes: Record<Size, string> = {
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3.5 text-base",
};

interface CommonProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
}

/** Bouton classique */
export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: CommonProps & ComponentProps<"button">) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...props}>
      {children}
    </button>
  );
}

/** Lien stylé comme un bouton (navigation interne) */
export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: CommonProps & { href: string }) {
  return (
    <Link href={href} className={cn(base, variants[variant], sizes[size], className)}>
      {children}
    </Link>
  );
}
