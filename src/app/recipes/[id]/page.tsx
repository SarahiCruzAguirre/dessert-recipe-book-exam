/**
 * SIDE: Client-side
 * Description: Detailed view of a single recipe. Displays preparation time, serving count,
 * ingredients card, step-by-step instructions, and an interactive favorite toggle CTA.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Image from "next/image";
import {
  Clock,
  ChefHat,
  Users,
  ArrowLeft,
} from "lucide-react";
import { IRecipe } from "@/types";
import { useI18n } from "@/context/I18nContext";
import CatFavoriteIcon from "@/components/illustrations/CatFavoriteIcon";

const difficultyColor: Record<string, string> = {
  Fácil: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
  Medio: "text-brand-brown bg-brand-brown/10 border-brand-brown/20",
  Difícil: "text-rose-600 bg-rose-50 border-rose-100",
};

export default function RecipeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data: session } = useSession();
  const { t } = useI18n();

  const [recipe, setRecipe] = useState<IRecipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);
  const [toggling, setToggling] = useState(false);

  const getDifficultyLabel = (diff: string) => {
    if (diff === "Fácil") return t("home.easy");
    if (diff === "Medio") return t("home.medium");
    if (diff === "Difícil") return t("home.hard");
    return diff;
  };

  useEffect(() => {
    fetch(`/api/recipes/${id}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRecipe(d.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/favorites?idsOnly=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setIsFavorite(d.data.includes(id));
      });
  }, [session, id]);

  const handleToggle = useCallback(async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    setToggling(true);
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId: id }),
    });
    const data = await res.json();
    if (data.success) setIsFavorite(data.data.isFavorite);
    setToggling(false);
  }, [session, id, router]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-10 animate-pulse">
        <div className="skeleton h-80 rounded-3xl mb-8" />
        <div className="space-y-4">
          <div className="skeleton h-8 w-2/3 rounded-xl" />
          <div className="skeleton h-4 w-full rounded-xl" />
          <div className="skeleton h-4 w-3/4 rounded-xl" />
        </div>
      </div>
    );
  }

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center bg-brand-cream/10 rounded-3xl border border-dashed border-brand-blue/10">
        <p className="text-brand-charcoal/70 text-xl font-medium">{t("recipe_detail.not_found")}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 text-brand-blue hover:underline font-bold cursor-pointer"
        >
          {t("recipe_detail.go_home")}
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-brand-charcoal/70 hover:text-brand-blue mb-6 transition-colors text-sm font-semibold cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        {t("recipe_detail.back")}
      </button>

      {/* Hero imagen */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden mb-8 shadow-sm">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/70 via-brand-charcoal/10 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <span className="text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-xl bg-brand-blue text-brand-white shadow-sm mb-3 inline-block">
            {t("categories." + recipe.category) || recipe.category}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold text-brand-white leading-tight font-display">
            {recipe.name}
          </h1>
        </div>
        {/* Botón favorito */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className="absolute top-4 right-4 p-3 rounded-full bg-brand-white/80 backdrop-blur-sm border border-brand-blue/10 hover:border-brand-blue/30 transition-all disabled:opacity-50 cursor-pointer shadow-sm group"
        >
          <CatFavoriteIcon
            className={`w-5 h-5 transition-colors ${
              isFavorite
                ? "text-brand-blue"
                : "text-brand-charcoal/60 group-hover:text-brand-blue"
            }`}
            filled={isFavorite}
          />
        </button>
      </div>

      {/* Meta info */}
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-cream/35 border border-brand-blue/10 rounded-2xl text-sm font-semibold">
          <Clock className="w-4 h-4 text-brand-blue" />
          <span className="text-brand-charcoal">{recipe.prepTime} {t("recipe_card.prep_time")}</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-semibold border ${difficultyColor[recipe.difficulty]}`}>
          <ChefHat className="w-4 h-4" />
          <span>{getDifficultyLabel(recipe.difficulty)}</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-brand-cream/35 border border-brand-blue/10 rounded-2xl text-sm font-semibold">
          <Users className="w-4 h-4 text-brand-blue" />
          <span className="text-brand-charcoal">{recipe.servings} {t("recipe_detail.portions")}</span>
        </div>
      </div>

      {/* Descripción */}
      <p className="text-brand-charcoal/80 text-lg leading-relaxed mb-10">
        {recipe.description}
      </p>

      <div className="grid sm:grid-cols-2 gap-8">
        {/* Ingredientes */}
        <section className="bg-brand-cream/25 border border-brand-blue/5 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-brand-charcoal mb-4 pb-2 border-b border-brand-blue/10 font-display">
            {t("recipe_detail.ingredients")}
          </h2>
          <ul className="space-y-3">
            {recipe.ingredients.map((ingredient, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-brand-charcoal/80 font-medium">
                <span className="mt-1.5 w-2 h-2 rounded-full bg-brand-blue shrink-0" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Pasos */}
        <section className="bg-brand-cream/25 border border-brand-blue/5 rounded-3xl p-6">
          <h2 className="text-xl font-bold text-brand-charcoal mb-4 pb-2 border-b border-brand-blue/10 font-display">
            {t("recipe_detail.preparation")}
          </h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 font-medium">
                <div className="shrink-0 w-6 h-6 rounded-full bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-xs font-bold text-brand-blue">
                  {i + 1}
                </div>
                <p className="text-sm text-brand-charcoal/70 leading-relaxed pt-0.5">
                  {step}
                </p>
              </li>
            ))}
          </ol>
        </section>
      </div>

      {/* CTA favorito al final */}
      {session && (
        <div className="mt-12 p-6 bg-brand-cream/35 border border-brand-blue/10 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div>
            <p className="text-brand-charcoal font-bold font-display text-base">
              {isFavorite ? t("recipe_detail.fav_title_saved") : t("recipe_detail.fav_title_not_saved")}
            </p>
            <p className="text-brand-charcoal/60 text-sm mt-0.5 font-medium">
              {isFavorite ? t("recipe_detail.fav_desc_saved") : t("recipe_detail.fav_desc_not_saved")}
            </p>
          </div>
          <button
            onClick={handleToggle}
            disabled={toggling}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all disabled:opacity-50 cursor-pointer ${
              isFavorite
                ? "bg-brand-blue/10 border border-brand-blue/20 text-brand-blue hover:bg-brand-blue/20"
                : "bg-brand-blue text-brand-white hover:bg-brand-blue/90 shadow-sm"
            }`}
          >
            {isFavorite ? (
              <>
                <CatFavoriteIcon className="w-4 h-4" filled={true} />
                <span>{t("recipe_detail.saved")}</span>
              </>
            ) : (
              <>
                <CatFavoriteIcon className="w-4 h-4" filled={false} />
                <span>{t("recipe_detail.save")}</span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
