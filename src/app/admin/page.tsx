"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Shield,
  BookmarkCheck,
  Mail,
  Send,
  ChevronDown,
  ChevronUp,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useI18n } from "@/context/I18nContext";

interface FavoriteEntry {
  _id: string;
  userId: { name: string; email: string; role?: string };
  recipeId: { name: string; image: string };
  createdAt: string;
}

interface GroupedUser {
  name: string;
  email: string;
  role?: string;
  recipes: string[];
  count: number;
}

export default function AdminPage() {
  const { t } = useI18n();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<FavoriteEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedUser, setExpandedUser] = useState<string | null>(null);

  // Email form
  const [selectedUser, setSelectedUser] = useState<{ name: string; email: string } | null>(null);
  const [emailType, setEmailType] = useState<"welcome" | "custom">("welcome");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [emailResult, setEmailResult] = useState<{ success: boolean; message: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true);
    }, 0);

    fetch("/api/admin/favorites")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFavorites(d.data);
      })
      .finally(() => setLoading(false));

    return () => clearTimeout(timer);
  }, []);

  // Agrupar por usuario
  const grouped = favorites.reduce<Record<string, GroupedUser>>((acc, f) => {
    if (!f.userId) return acc;
    const email = f.userId.email;
    if (!acc[email]) {
      acc[email] = {
        name: f.userId.name,
        email,
        role: f.userId.role || "user",
        recipes: [],
        count: 0
      };
    }
    if (f.recipeId?.name) {
      acc[email].recipes.push(f.recipeId.name);
      acc[email].count++;
    }
    return acc;
  }, {});

  const users = Object.values(grouped).sort((a, b) => b.count - a.count);

  const admins = users.filter((u) => u.role === "admin");
  const regularUsers = users.filter((u) => u.role !== "admin");

  const handleSendEmail = async () => {
    if (!selectedUser) return;
    setSending(true);
    setEmailResult(null);

    try {
      const res = await fetch("/api/admin/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to: selectedUser.email,
          recipientName: selectedUser.name,
          type: emailType,
          subject: emailType === "custom" ? subject : undefined,
          message: emailType === "custom" ? message : undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEmailResult({ success: true, message: t("admin_page.success_send") });
        setSubject("");
        setMessage("");
      } else {
        setEmailResult({ success: false, message: data.error || "Error" });
      }
    } catch {
      setEmailResult({ success: false, message: t("admin_page.error_connection") });
    } finally {
      setSending(false);
    }
  };

  const renderUserRow = (user: GroupedUser, showEmailAction: boolean) => {
    const isCurrentUser = session?.user?.email === user.email;
    return (
      <div
        key={user.email}
        className="bg-brand-cream/35 border border-brand-blue/10 rounded-2xl overflow-hidden hover:border-brand-blue/20 transition-colors"
      >
        <div
          onClick={() =>
            setExpandedUser(expandedUser === user.email ? null : user.email)
          }
          className="w-full flex items-center justify-between p-4 hover:bg-brand-cream/50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-xs font-bold text-brand-blue">
              {user.name[0].toUpperCase()}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-brand-charcoal">{user.name}</p>
                {user.role === "admin" && (
                  <span className="text-[9px] font-bold text-brand-white bg-brand-brown px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Admin
                  </span>
                )}
                {isCurrentUser && (
                  <span className="text-[9px] font-bold text-brand-blue bg-brand-blue/10 border border-brand-blue/20 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                    Tú
                  </span>
                )}
              </div>
              <p className="text-xs text-brand-charcoal/50 font-medium">{user.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-brand-blue bg-brand-blue/10 px-2.5 py-0.5 rounded-full">
              {user.count} {user.count === 1 ? t("admin_page.recipes_count_single") : t("admin_page.recipes_count_plural")}
            </span>
            <div className="flex gap-2">
              {showEmailAction && !isCurrentUser && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedUser({ name: user.name, email: user.email });
                    setEmailType("welcome");
                    setEmailResult(null);
                  }}
                  title={t("admin_page.send_email")}
                  className="p-1.5 rounded-xl text-brand-charcoal/50 hover:text-brand-blue hover:bg-brand-blue/10 transition-all cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                </button>
              )}
              {expandedUser === user.email ? (
                <ChevronUp className="w-4 h-4 text-brand-charcoal/50" />
              ) : (
                <ChevronDown className="w-4 h-4 text-brand-charcoal/50" />
              )}
            </div>
          </div>
        </div>

        {expandedUser === user.email && (
          <div className="px-4 pb-4 border-t border-brand-blue/10 pt-3 bg-brand-white/40">
            <p className="text-xs text-brand-charcoal/50 mb-2.5 uppercase tracking-wider font-bold">
              {t("admin_page.saved_recipes")}
            </p>
            <ul className="space-y-2">
              {user.recipes.map((r, i) => (
                <li
                  key={i}
                  className="flex items-center gap-2 text-sm text-brand-charcoal/80 font-medium"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-blue flex-shrink-0" />
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 animate-pulse">
        <div className="h-10 w-48 bg-brand-cream/35 rounded-xl mb-8" />
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="h-80 bg-brand-cream/20 rounded-3xl" />
          <div className="h-80 bg-brand-cream/20 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center">
          <Shield className="w-5 h-5 text-brand-blue" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-brand-charcoal font-display">{t("admin_page.title")}</h1>
          <p className="text-brand-charcoal/60 text-sm font-medium">{t("admin_page.subtitle")}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* ── Favoritos por usuario ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BookmarkCheck className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-charcoal font-display">
              {t("admin_page.users_favorites")}
            </h2>
            <span className="ml-auto text-xs text-brand-charcoal/80 bg-brand-cream/80 border border-brand-blue/5 px-2.5 py-0.5 rounded-full font-semibold">
              {users.length} {t("admin_page.users_count")}
            </span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="skeleton h-16 rounded-2xl" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-12 text-brand-charcoal/50 bg-brand-cream/15 rounded-3xl border border-dashed border-brand-blue/10">
              <BookmarkCheck className="w-10 h-10 mx-auto mb-2 opacity-30 text-brand-blue" />
              <p className="text-sm font-semibold">{t("admin_page.no_favorites_yet")}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Sección de Usuarios */}
              <div>
                <h3 className="text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-3 px-1">
                  {t("admin_page.regular_users")}
                </h3>
                {regularUsers.length === 0 ? (
                  <p className="text-xs text-brand-charcoal/40 italic px-1">{t("admin_page.no_favorites_yet")}</p>
                ) : (
                  <div className="space-y-3">
                    {regularUsers.map((u) => renderUserRow(u, true))}
                  </div>
                )}
              </div>

              {/* División decorativa */}
              <hr className="border-brand-blue/10" />

              {/* Sección de Administradores */}
              <div>
                <h3 className="text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-3 px-1">
                  {t("admin_page.administrators")}
                </h3>
                {admins.length === 0 ? (
                  <p className="text-xs text-brand-charcoal/40 italic px-1">No hay administradores con favoritos.</p>
                ) : (
                  <div className="space-y-3">
                    {admins.map((u) => renderUserRow(u, false))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ── Enviar correo ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-5 h-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-brand-charcoal font-display">{t("admin_page.send_email")}</h2>
          </div>

          <div className="bg-brand-cream/35 border border-brand-blue/10 rounded-2xl p-5 shadow-sm">
            {/* Destinatario */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-2">
                {t("admin_page.recipient")}
              </label>
              {selectedUser ? (
                <div className="flex items-center justify-between p-3 bg-brand-white border border-brand-blue/20 rounded-2xl shadow-sm">
                  <div>
                    <p className="text-sm font-bold text-brand-charcoal">{selectedUser.name}</p>
                    <p className="text-xs text-brand-charcoal/50 font-medium">{selectedUser.email}</p>
                  </div>
                  <button
                    onClick={() => { setSelectedUser(null); setEmailResult(null); }}
                    className="text-xs font-bold text-brand-blue hover:text-brand-blue/80 cursor-pointer"
                  >
                    {t("admin_page.recipient_change")}
                  </button>
                </div>
              ) : (
                <div className="p-4 bg-brand-cream/20 border border-dashed border-brand-blue/25 rounded-2xl text-center">
                  <p className="text-sm font-semibold text-brand-charcoal/40">
                    {t("admin_page.recipient_select_tip")}
                  </p>
                </div>
              )}
            </div>

            {/* Tipo de correo */}
            <div className="mb-4">
              <label className="block text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-2">
                {t("admin_page.email_type")}
              </label>
              <div className="flex gap-2">
                {(["welcome", "custom"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => { setEmailType(type); setEmailResult(null); }}
                    className={`flex-1 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                      emailType === type
                        ? "bg-brand-blue text-brand-white shadow-sm"
                        : "bg-brand-cream border border-brand-blue/10 text-brand-charcoal/70 hover:border-brand-blue/30"
                    }`}
                  >
                    {type === "welcome" ? t("admin_page.email_welcome") : t("admin_page.email_custom")}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview bienvenida o formulario personalizado */}
            {emailType === "welcome" ? (
              <div className="mb-4 p-4 bg-brand-white border border-brand-blue/15 rounded-2xl text-sm text-brand-charcoal/75 shadow-sm font-medium leading-relaxed">
                <p className="text-brand-charcoal font-bold mb-1">{t("admin_page.preview")}</p>
                <p>
                  {t("admin_page.preview_welcome_desc")}
                  <span className="text-brand-blue font-bold">{selectedUser?.name ?? t("admin_page.selected_user")}</span>.
                </p>
              </div>
            ) : (
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-1.5">
                    {t("admin_page.subject")}
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder={t("admin_page.subject_placeholder")}
                    className="w-full px-4 py-2.5 bg-brand-white border border-brand-blue/15 rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:border-brand-blue transition-colors font-semibold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-brand-charcoal/60 uppercase tracking-wider mb-1.5">
                    {t("admin_page.message")}
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={t("admin_page.message_placeholder")}
                    rows={5}
                    className="w-full px-4 py-2.5 bg-brand-white border border-brand-blue/15 rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/30 focus:outline-none focus:border-brand-blue transition-colors resize-none font-medium"
                  />
                </div>
              </div>
            )}

            {/* Resultado */}
            {emailResult && (
              <div
                className={`flex items-center gap-2 px-4 py-3 rounded-2xl text-sm mb-4 font-semibold ${
                  emailResult.success
                    ? "bg-emerald-55 border border-emerald-100 text-emerald-600"
                    : "bg-rose-50 border border-rose-100 text-rose-600"
                }`}
              >
                {emailResult.success ? (
                  <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
                ) : (
                  <XCircle className="w-4 h-4 flex-shrink-0 text-rose-500" />
                )}
                <span>{emailResult.message}</span>
              </div>
            )}

            {/* Enviar */}
            <button
              onClick={handleSendEmail}
              disabled={
                !selectedUser ||
                sending ||
                (emailType === "custom" && (!subject || !message))
              }
              className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue text-brand-white font-bold rounded-2xl hover:bg-brand-blue/90 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
            >
              {sending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>{t("admin_page.sending_button")}</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{t("admin_page.send_button")}</span>
                </>
              )}
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
