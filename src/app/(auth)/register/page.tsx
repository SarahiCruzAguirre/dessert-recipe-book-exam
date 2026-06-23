/**
 * SIDE: Client-side
 * Description: Registration page. Provides users with registration input fields,
 * real-time strength feedback on passwords, and form validation, integrated with Spline 3D.
 */

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Script from "next/script";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import CuteCroissant from "@/components/illustrations/CuteCroissant";


export default function RegisterPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  // Field validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isNameValid = form.name.trim() !== "";
  const isEmailValid = emailRegex.test(form.email);
  const isPasswordValid = form.password.length >= 6;
  const arePasswordsMatching = form.password === form.confirm;
  const isFormValid = isNameValid && isEmailValid && isPasswordValid && arePasswordsMatching;

  // Strength checker
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: "", color: "bg-brand-cream", width: "w-0" };
    if (pass.length < 6) {
      return {
        score: 1,
        label: t("register_page.strength_weak"),
        color: "bg-rose-500",
        width: "w-1/3",
      };
    }

    const hasLetters = /[a-zA-Z]/.test(pass);
    const hasNumbers = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    const hasUppercase = /[A-Z]/.test(pass);
    const hasLowercase = /[a-z]/.test(pass);

    const isStrong = pass.length >= 8 && hasLetters && hasNumbers && hasSpecial && hasUppercase && hasLowercase;

    if (isStrong) {
      return {
        score: 3,
        label: t("register_page.strength_strong"),
        color: "bg-emerald-500",
        width: "w-full",
      };
    }

    return {
      score: 2,
      label: t("register_page.strength_medium"),
      color: "bg-brand-blue",
      width: "w-2/3",
    };
  };

  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json();

      if (!data.success) {
        setError(data.error || t("register_page.error_generic"));
      } else {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 2500);
      }
    } catch {
      setError(t("register_page.error_generic"));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-brand-white">
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:w-1/2">
          <div className="text-center max-w-sm w-full">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-brand-charcoal font-display mb-2">{t("register_page.success_title")}</h2>
            <p className="text-brand-charcoal/60 text-sm font-medium">
              {t("register_page.success_desc")}
            </p>
          </div>
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
              {t("register_page.right_title")}
            </h2>
            <p className="text-brand-white/80 text-xs leading-relaxed font-medium">
              {t("register_page.right_desc")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col lg:flex-row bg-brand-white">
      {/* Columna Izquierda (Formulario) */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:w-1/2">
        <div className="w-full max-w-sm">
          {/* Logo / Header */}
          <div className="flex flex-col items-start mb-6">
            <div className="w-12 h-12 flex items-center justify-center mb-4 bg-brand-cream/50 rounded-2xl border border-brand-blue/10">
              <CuteCroissant width={36} height={36} />
            </div>
            <h1 className="text-3xl font-bold text-brand-charcoal font-display">{t("register_page.title")}</h1>
            <p className="text-brand-charcoal/60 text-sm mt-2 font-medium">
              {t("register_page.subtitle")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider">
                {t("register_page.name")}
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder={t("register_page.name_placeholder")}
                className="w-full px-4 py-2.5 bg-brand-cream/25 border border-brand-blue/10 rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:border-brand-blue transition-colors font-medium"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider">{t("login_page.email")}</label>
              <input
                type="email"
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

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider">{t("login_page.password")}</label>
              <div className="relative mb-2">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder={t("register_page.password_placeholder")}
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

              {/* Password Strength Meter */}
              {form.password && (
                <div className="space-y-1.5 mb-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-brand-charcoal/50 font-semibold">{t("register_page.strength_label")}</span>
                    <span className={`font-bold ${
                      strength.score === 1
                        ? "text-rose-500"
                        : strength.score === 2
                        ? "text-brand-brown"
                        : "text-emerald-600"
                    }`}>
                      {strength.label}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-brand-cream rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`} />
                  </div>
                </div>
              )}
            </div>

            {/* Confirmar */}
            <div>
              <label className="block text-xs font-bold text-brand-charcoal/70 mb-1.5 uppercase tracking-wider">
                {t("register_page.confirm_password")}
              </label>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={form.confirm}
                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                placeholder={t("register_page.confirm_placeholder")}
                className={`w-full px-4 py-2.5 bg-brand-cream/25 border rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none transition-colors font-medium ${
                  form.confirm && !arePasswordsMatching
                    ? "border-rose-500 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                    : "border-brand-blue/10 focus:border-brand-blue"
                }`}
              />
              {form.confirm && !arePasswordsMatching && (
                <p className="text-rose-500 text-[11px] mt-1.5 font-semibold">
                  {t("register_page.passwords_dont_match")}
                </p>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="px-4 py-2.5 bg-rose-50 border border-rose-100 rounded-2xl text-xs text-rose-600 font-semibold">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || !isFormValid}
              className="w-full py-3 bg-brand-blue text-brand-white font-bold rounded-2xl hover:bg-brand-blue/90 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("register_page.button_loading")}</span>
                </>
              ) : (
                <span>{t("register_page.button")}</span>
              )}
            </button>
          </form>

          <p className="text-start text-sm text-brand-charcoal/60 mt-6 font-medium">
            {t("register_page.have_account")}{" "}
            <Link href="/login" className="text-brand-blue hover:underline font-bold">
              {t("register_page.login_link")}
            </Link>
          </p>
        </div>
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
            {t("register_page.right_title")}
          </h2>
          <p className="text-brand-white/80 text-xs leading-relaxed font-medium">
            {t("register_page.right_desc")}
          </p>
        </div>
      </div>
    </div>
  );
}
