/**
 * SIDE: Client-side
 * Description: Global application header/navigation bar. Handles links to catalog and private views (favorites, admin),
 * provides language switching controls (ES/EN), and user session indicators (Login/Logout buttons).
 */

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { LogIn, LogOut, Shield, User, Globe } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import CuteCroissant from "@/components/illustrations/CuteCroissant";
import CatFavoriteIcon from "@/components/illustrations/CatFavoriteIcon";


export default function Navbar() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const { t, locale, setLocale } = useI18n();

  const isActive = (path: string) =>
    pathname === path
      ? "text-brand-blue font-semibold border-b-2 border-brand-blue"
      : "text-brand-charcoal/70 hover:text-brand-blue transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-brand-blue/10 bg-brand-white/80 backdrop-blur-md">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
            <CuteCroissant width={36} height={36} />
          </div>
          <span className="font-display font-bold text-xl text-brand-charcoal tracking-tight">
            Crumb<span className="text-brand-blue">Club</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className={`px-1 py-1 text-sm font-medium transition-colors ${isActive("/")}`}
          >
            {t("nav.recipes")}
          </Link>

          {session && (
            <Link
              href="/favorites"
              className={`flex items-center gap-1.5 px-1 py-1 text-sm font-medium transition-colors ${isActive("/favorites")}`}
            >
              <CatFavoriteIcon className="w-4 h-4" filled={pathname === "/favorites"} />
              <span>{t("nav.favorites")}</span>
            </Link>
          )}

          {session?.user?.role === "admin" && (
            <Link
              href="/admin"
              className={`flex items-center gap-1.5 px-1 py-1 text-sm font-medium transition-colors ${isActive("/admin")}`}
            >
              <Shield className="w-4 h-4" />
              <span>{t("nav.admin")}</span>
            </Link>
          )}
        </div>

        {/* Auth & i18n */}
        <div className="flex items-center gap-3">
          {/* Language Switcher */}
          <button
            onClick={() => setLocale(locale === "es" ? "en" : "es")}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-brand-cream border border-brand-blue/10 text-brand-charcoal hover:text-brand-blue hover:bg-brand-cream/80 transition-colors cursor-pointer"
            title="Cambiar idioma / Change language"
          >
            <Globe className="w-3.5 h-3.5 text-brand-blue" />
            <span>{locale === "es" ? "EN" : "ES"}</span>
          </button>

          {status === "loading" ? (
            <div className="w-24 h-8 rounded-xl bg-brand-cream animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm">
                <div className="w-7 h-7 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-brand-blue" />
                </div>
                <span className="hidden sm:block text-brand-charcoal font-medium">
                  {session.user.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-brand-charcoal/70 hover:text-rose-600 hover:bg-rose-50 border border-transparent transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:block">{t("nav.logout")}</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm text-brand-charcoal hover:text-brand-blue transition-colors font-medium"
              >
                <LogIn className="w-4 h-4 text-brand-blue" />
                {t("nav.login")}
              </Link>
              <Link
                href="/register"
                className="px-4 py-1.5 rounded-xl text-sm font-semibold bg-brand-blue text-brand-white hover:bg-brand-blue/90 shadow-sm transition-colors"
              >
                {t("nav.register")}
              </Link>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
