/**
 * SIDE: Client-side
 * Description: Favorites page. Displays the list of recipes that the currently logged-in user
 * has saved as favorites. Permits toggling (removing) directly from the grid.
 */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RecipeCard from "@/components/RecipeCard";
import { IRecipe } from "@/types";
import { ChefHat } from "lucide-react";
import Link from "next/link";
import { useI18n } from "@/context/I18nContext";
import CatFavoriteIcon from "@/components/illustrations/CatFavoriteIcon";

export default function FavoritesPage() {
  const { data: session } = useSession();
  const { t } = useI18n();
  const [favorites, setFavorites] = useState<IRecipe[]>([]);
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch the user's favorite recipes on mount
  useEffect(() => {
    fetch("/api/favorites")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFavorites(data.data);
          setFavoriteIds(data.data.map((r: IRecipe) => r._id));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  // Handles toggling a recipe favorite status; removes it from layout if unfavorited
  const handleToggle = async (recipeId: string) => {
    const res = await fetch("/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ recipeId }),
    });
    const data = await res.json();
    if (data.success && !data.data.isFavorite) {
      setFavorites((prev) => prev.filter((r) => r._id !== recipeId));
      setFavoriteIds((prev) => prev.filter((id) => id !== recipeId));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="mb-8">
        <div className="flex items-center gap-2.5 mb-2">
          <CatFavoriteIcon className="w-6 h-6 text-brand-blue" filled={true} />
          <h1 className="text-3xl font-bold text-brand-charcoal font-display">{t("favorites_page.title")}</h1>
        </div>
        <p className="text-brand-charcoal/60 font-medium">
          {t("favorites_page.greeting", { name: session?.user?.name || "" })}
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-3xl overflow-hidden bg-brand-cream/35 border border-brand-blue/5">
              <div className="skeleton h-48 w-full" />
              <div className="p-5 space-y-3">
                <div className="skeleton h-5 w-3/4 rounded-xl" />
                <div className="skeleton h-4 w-full rounded-xl" />
              </div>
            </div>
          ))}
        </div>
      ) : favorites.length === 0 ? (
        <div className="text-center py-20 bg-brand-cream/15 rounded-3xl border border-dashed border-brand-blue/10">
          <ChefHat className="w-16 h-16 text-brand-charcoal/30 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-brand-charcoal/60 mb-2 font-display">
            {t("favorites_page.empty_title")}
          </h2>
          <p className="text-brand-charcoal/50 text-sm mb-6 font-medium">
            {t("favorites_page.empty_desc")}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-blue text-brand-white font-bold rounded-2xl hover:bg-brand-blue/90 shadow-sm transition-colors cursor-pointer"
          >
            {t("favorites_page.view_recipes")}
          </Link>
        </div>
      ) : (
        <>
          <p className="text-brand-charcoal/50 text-sm mb-6 font-medium">
            {favorites.length} {favorites.length === 1 ? t("favorites_page.saved_count_single") : t("favorites_page.saved_count_plural")}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((recipe) => (
              <RecipeCard
                key={recipe._id}
                recipe={recipe}
                isFavorite={favoriteIds.includes(recipe._id)}
                onToggleFavorite={handleToggle}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

