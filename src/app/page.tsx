/**
 * SIDE: Client-side
 * Description: Homepage of the application. Displays the decorative hero banner with CatBaguette,
 * interactive search inputs, difficulty filter buttons, and the responsive grid of recipes.
 */

"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/RecipeCard";
import { IRecipe } from "@/types";
import { Search, SlidersHorizontal } from "lucide-react";
import { useI18n } from "@/context/I18nContext";
import CatBaguette from "@/components/illustrations/CatBaguette";

export default function HomePage() {
  const { data: session } = useSession();
  const { t } = useI18n();

  // State management for recipes list, user favorites, loading, and filters
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficulty, setDifficulty] = useState("Todos");

  const difficulties = [
    { key: "Todos", label: t("home.all") },
    { key: "Fácil", label: t("home.easy") },
    { key: "Medio", label: t("home.medium") },
    { key: "Difícil", label: t("home.hard") },
  ];

  // Fetch all recipes from DB on mount
  useEffect(() => {
    fetch("/api/recipes")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setRecipes(d.data);
      })
      .finally(() => setLoading(false));
  }, []);

  // Fetch favorited recipe IDs if user is signed in
  useEffect(() => {
    if (!session) return;
    fetch("/api/favorites?idsOnly=true")
      .then((r) => r.json())
      .then((d) => {
        if (d.success) setFavoriteIds(d.data);
      });
  }, [session]);

  // Toggle favorite recipe status via API
  const handleToggleFavorite = useCallback(
    async (recipeId: string) => {
      if (!session) {
        window.location.href = "/login";
        return;
      }
      const res = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId }),
      });
      const data = await res.json();
      if (data.success) {
        setFavoriteIds((prev) =>
          data.data.isFavorite
            ? [...prev, recipeId]
            : prev.filter((id) => id !== recipeId)
        );
      }
    },
    [session]
  );

  // Client-side search and difficulty filters matching
  const filtered = recipes.filter((r) => {
    const matchSearch =
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.category.toLowerCase().includes(search.toLowerCase());
    const matchDifficulty = difficulty === "Todos" || r.difficulty === difficulty;
    return matchSearch && matchDifficulty;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      {/* Hero Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10 bg-brand-cream/40 rounded-3xl p-6 sm:p-10 border border-brand-blue/10 shadow-sm">
        <div className="flex-1 space-y-4">
          <span className="inline-block px-3 py-1 bg-brand-blue/10 text-brand-blue text-xs font-bold tracking-wider uppercase rounded-full">
            {t("home.subtitle_tag")}
          </span>
          <h1 className="text-4xl sm:text-5xl font-bold text-brand-charcoal leading-tight font-display">
            {t("home.title")}
            <br />
            <span className="text-brand-blue">{t("home.title_highlight")}</span>
          </h1>
          <p className="text-brand-charcoal/80 text-base sm:text-lg max-w-xl">
            {t("home.description")}
          </p>
        </div>
        <div className="w-40 h-40 sm:w-48 sm:h-48 shrink-0 animate-float">
          <CatBaguette width="100%" height="100%" />
        </div>
      </div>

      {/* Filter and Search controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-brand-charcoal/50" />
          <input
            type="text"
            placeholder={t("home.search_placeholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-brand-cream/30 border border-brand-blue/10 rounded-2xl text-sm text-brand-charcoal placeholder-brand-charcoal/40 focus:outline-none focus:border-brand-blue/40 transition-colors"
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          <SlidersHorizontal className="w-4 h-4 text-brand-charcoal/50 shrink-0" />
          {difficulties.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setDifficulty(key)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                difficulty === key
                  ? "bg-brand-blue text-brand-white shadow-sm"
                  : "bg-brand-cream/50 border border-brand-blue/5 text-brand-charcoal/70 hover:border-brand-blue/20 hover:text-brand-blue"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Recipes Showcase Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="rounded-3xl overflow-hidden bg-brand-cream/30 border border-brand-blue/5">
              <div className="skeleton h-48 w-full" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-xl" />
                <div className="skeleton h-4 w-full rounded-xl" />
                <div className="skeleton h-4 w-2/3 rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-brand-cream/10 rounded-3xl border border-dashed border-brand-blue/10">
          <p className="text-brand-charcoal/50 text-lg font-medium">{t("home.no_recipes")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe._id}
              recipe={recipe}
              isFavorite={favoriteIds.includes(recipe._id)}
              onToggleFavorite={handleToggleFavorite}
            />
          ))}
        </div>
      )}
    </div>
  );
}
