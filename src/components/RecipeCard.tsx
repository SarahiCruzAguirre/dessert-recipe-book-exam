/**
 * SIDE: Client-side
 * Description: RecipeCard component rendered inside lists. Displays the recipe image,
 * name, description, categories, preparation time, difficulty label, and favorite toggler button.
 */

"use client";

import Link from "next/link";
import Image from "next/image";
import { Clock, ChefHat } from "lucide-react";
import { RecipeCardProps } from "@/types";
import { useI18n } from "@/context/I18nContext";
import CatFavoriteIcon from "@/components/illustrations/CatFavoriteIcon";

// Styling classes mapped to recipe difficulty values
const difficultyColor: Record<string, string> = {
  Fácil: "text-brand-blue bg-brand-blue/10 border-brand-blue/20",
  Medio: "text-brand-brown bg-brand-brown/10 border-brand-brown/20",
  Difícil: "text-rose-600 bg-rose-50 border-rose-100",
};

export default function RecipeCard({
  recipe,
  isFavorite = false,
  onToggleFavorite,
}: RecipeCardProps) {
  const { t } = useI18n();

  // Mapped translation of difficulty tags
  const getDifficultyLabel = (diff: string) => {
    if (diff === "Fácil") return t("home.easy");
    if (diff === "Medio") return t("home.medium");
    if (diff === "Difícil") return t("home.hard");
    return diff;
  };

  return (
    <article className="group relative bg-brand-cream/30 border border-brand-blue/10 rounded-3xl overflow-hidden hover:border-brand-blue/30 hover:bg-brand-cream/50 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(7,37,176,0.06)]">
      {/* Recipe image overlay and container */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={recipe.image}
          alt={recipe.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-brand-charcoal/30 to-transparent" />

        {/* Botón favorito */}
        {onToggleFavorite && (
          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleFavorite(recipe._id);
            }}
            aria-label={isFavorite ? t("recipe_card.remove_favorite") : t("recipe_card.add_favorite")}
            className="absolute top-3 right-3 p-2 rounded-full bg-brand-white/80 backdrop-blur-sm border border-brand-blue/10 transition-all duration-200 hover:border-brand-blue/30 hover:bg-brand-white cursor-pointer shadow-sm group"
          >
            <CatFavoriteIcon
              className={`w-5 h-5 transition-colors ${
                isFavorite
                  ? "text-brand-blue"
                  : "text-brand-charcoal/50 group-hover:text-brand-blue"
              }`}
              filled={isFavorite}
            />
          </button>
        )}


        {/* Categoría */}
        <span className="absolute bottom-3 left-3 text-[10px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-xl bg-brand-blue text-brand-white shadow-sm">
          {t("categories." + recipe.category) || recipe.category}
        </span>
      </div>

      {/* Contenido */}
      <div className="p-5">
        <h3 className="font-display font-bold text-brand-charcoal text-lg leading-snug mb-2 line-clamp-1 group-hover:text-brand-blue transition-colors">
          {recipe.name}
        </h3>
        <p className="text-sm text-brand-charcoal/70 line-clamp-2 mb-4 leading-relaxed">
          {recipe.description}
        </p>

        <div className="flex items-center justify-between">
          {/* Tiempo y dificultad */}
          <div className="flex items-center gap-2.5">
            <div className="flex items-center gap-1 text-brand-charcoal/60 text-xs">
              <Clock className="w-3.5 h-3.5 text-brand-blue/70" />
              <span>{recipe.prepTime} {t("recipe_card.prep_time")}</span>
            </div>
            <span
              className={`flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${difficultyColor[recipe.difficulty]}`}
            >
              <ChefHat className="w-3 h-3" />
              {getDifficultyLabel(recipe.difficulty)}
            </span>
          </div>

          {/* Ver receta */}
          <Link
            href={`/recipes/${recipe._id}`}
            className="text-xs font-bold text-brand-blue hover:text-brand-blue/80 transition-colors flex items-center gap-0.5"
          >
            {t("recipe_card.view_recipe")}
          </Link>
        </div>
      </div>
    </article>
  );
}
