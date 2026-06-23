import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import Recipe from "@/models/Recipe";
import { IRecipe } from "@/types";

// ── Obtener IDs de recetas favoritas de un usuario ───────────
export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  await connectDB();
  const favorites = await Favorite.find({ userId }).select("recipeId").lean();
  return favorites.map((f) => f.recipeId.toString());
}

// ── Obtener recetas favoritas completas de un usuario ────────
export async function getUserFavorites(userId: string): Promise<IRecipe[]> {
  await connectDB();
  const favorites = await Favorite.find({ userId })
    .populate("recipeId")
    .sort({ createdAt: -1 })
    .lean();

  const recipes = favorites
    .map((f) => f.recipeId as unknown as IRecipe)
    .filter(Boolean);

  return JSON.parse(JSON.stringify(recipes));
}

// ── Agregar a favoritos ──────────────────────────────────────
export async function addFavorite(
  userId: string,
  recipeId: string
): Promise<void> {
  await connectDB();
  // Verificar que la receta existe
  const recipe = await Recipe.findById(recipeId);
  if (!recipe) throw new Error("Receta no encontrada");

  // upsert para evitar duplicados
  await Favorite.findOneAndUpdate(
    { userId, recipeId },
    { userId, recipeId },
    { upsert: true, new: true }
  );
}

// ── Quitar de favoritos ──────────────────────────────────────
export async function removeFavorite(
  userId: string,
  recipeId: string
): Promise<void> {
  await connectDB();
  await Favorite.findOneAndDelete({ userId, recipeId });
}

// ── Toggle favorito ──────────────────────────────────────────
export async function toggleFavorite(
  userId: string,
  recipeId: string
): Promise<{ isFavorite: boolean }> {
  await connectDB();
  const existing = await Favorite.findOne({ userId, recipeId });

  if (existing) {
    await existing.deleteOne();
    return { isFavorite: false };
  } else {
    await addFavorite(userId, recipeId);
    return { isFavorite: true };
  }
}

// ── Admin: ver todos los favoritos agrupados por usuario ─────
export async function getAllFavoritesWithUsers() {
  await connectDB();
  const favorites = await Favorite.find({})
    .populate("userId", "name email role")
    .populate("recipeId", "name image")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(favorites));
}
