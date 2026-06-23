/**
 * SIDE: Client-side
 * Description: Login page. Contains LoginForm that handles credentials authentication through NextAuth.
 * Integrates interactive live validation for fields and imports a Spline 3D view for styling.
 */

"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import CuteCroissant from "@/components/illustrations/CuteCroissant";


function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";
  const { t } = useI18n();

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Live validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailValid = emailRegex.test(form.email);
  const isFormComplete = form.email.trim() !== "" && form.password.trim() !== "";
  const isFormValid = isFormComplete && isEmailValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;
    
    setError("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        email: form.email.trim(),
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        setError(t("login_page.invalid_credentials"));
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError(t("login_page.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm">
      <div className="flex flex-col items-start mb-8">
        <div className="w-12 h-12 flex items-center justify-center mb-4 bg-brand-cream/50 rounded-2xl border border-brand-blue/10">
          <CuteCroissant width={36} height={36} />
        </div>
        <h1 className="text-3xl font-bold text-brand-charcoal font-display">{t("login_page.title")}</h1>
        <p className="text-brand-charcoal/60 text-sm mt-2 font-medium">{t("login_page.subtitle")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Email */}
        <div>
          <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider" htmlFor="email">
            {t("login_page.email")}
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="correo@ejemplo.com"
            className={`w-full px-4 py-2.5 bg-brand-cream/25 border rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none transition-colors font-medium ${
              form.email && !isEmailValid
                ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                : "border-brand-blue/10 focus:border-brand-blue"
            }`}
          />
          {form.email && !isEmailValid && (
            <p className="text-rose-500 text-[11px] mt-1.5 font-semibold">
              {t("register_page.validation_email")}
            </p>
          )}
        </div>

        {/* Contraseña */}
        <div>
          <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider" htmlFor="password">
            {t("login_page.password")}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-brand-cream/25 border border-brand-blue/10 rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:border-brand-blue transition-colors pr-10 font-medium"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-charcoal/40 hover:text-brand-blue cursor-pointer"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {error && (
          <div className="px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading || !isFormValid}
          className="w-full py-3 bg-brand-blue text-brand-white font-bold rounded-2xl hover:bg-brand-blue/90 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t("login_page.button_loading")}</span>
            </>
          ) : (
            <span>{t("login_page.button")}</span>
          )}
        </button>
      </form>

      <p className="text-start text-sm text-brand-charcoal/60 mt-6 font-medium">
        {t("login_page.no_account")}{" "}
        <Link href="/register" className="text-brand-blue hover:underline font-bold">
          {t("login_page.register_link")}
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-brand-white">
      {/* Columna Izquierda (Formulario) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <Suspense fallback={<div className="skeleton h-80 w-full max-w-sm rounded-3xl" />}>
          <LoginForm />
        </Suspense>
      </div>

      {/* Columna Derecha (Ilustración / Animación Spline) */}
      <div className="hidden lg:flex lg:w-1/2 bg-brand-blue items-center justify-center relative overflow-hidden select-none">
        {/* Script de Spline */}
        <Script
          src="https://unpkg.com/@splinetool/viewer@1.12.97/build/spline-viewer.js"
          type="module"
          strategy="afterInteractive"
        />

        {/* Spline 3D Viewer */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center">
          {/* @ts-expect-error: spline-viewer is a custom 3D element */}
          <spline-viewer
            url="https://prod.spline.design/mdOiXufyYMmAxzgI/scene.splinecode"
            className="w-full h-full"
          />
        </div>
        
        {/* Contenido superpuesto de branding */}
        <div className="absolute bottom-12 left-12 right-12 z-10 bg-brand-charcoal/30 backdrop-blur-md p-6 rounded-3xl border border-brand-white/10 text-brand-white text-center">
          <h2 className="text-2xl font-bold font-display mb-2">
            {t("login_page.right_title")}
          </h2>
          <p className="text-brand-white/80 text-xs leading-relaxed font-medium">
            {t("login_page.right_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
