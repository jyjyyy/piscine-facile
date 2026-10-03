"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { mainNav, siteConfig } from "@/config/site";
import { LogoMark } from "@/components/illustrations/Logo";
import { cn } from "@/components/ui/cn";

/** En-tête du site avec navigation responsive */
export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Mémorise le chemin pour refermer le menu mobile lors d'un changement de page
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-40 border-b border-eau-100 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-bold text-eau-950">
          <LogoMark />
          {siteConfig.name}
        </Link>

        <nav aria-label="Navigation principale" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    isActive(item.href) ? "bg-eau-50 text-eau-800" : "text-slate-700 hover:bg-eau-50 hover:text-eau-800",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/trouver-un-professionnel"
                className="ml-2 rounded-xl bg-turquoise-600 px-4 py-2 text-sm font-semibold text-white hover:bg-turquoise-700"
              >
                Trouver un pro
              </Link>
            </li>
          </ul>
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-eau-900 hover:bg-eau-50 lg:hidden"
          aria-expanded={open}
          aria-controls="menu-mobile"
          aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <nav id="menu-mobile" aria-label="Navigation mobile" className="border-t border-eau-100 bg-white lg:hidden">
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-3">
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "block rounded-xl px-4 py-3 text-base font-medium",
                    isActive(item.href) ? "bg-eau-50 text-eau-800" : "text-slate-800 hover:bg-eau-50",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/guide-electrique" className="block rounded-xl px-4 py-3 text-base font-medium text-slate-800 hover:bg-eau-50">
                Guide électrique
              </Link>
            </li>
            <li className="pt-2">
              <Link
                href="/trouver-un-professionnel"
                className="block rounded-xl bg-turquoise-600 px-4 py-3 text-center text-base font-semibold text-white"
              >
                Trouver un professionnel
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
