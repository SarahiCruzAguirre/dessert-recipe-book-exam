/**
 * SIDE: Server-side
 * Description: Service responsible for managing user favorite recipes, including adding,
 * removing, toggling favorites, and retrieving favorite recipes or structured user association.
 */

import { connectDB } from "@/lib/db";
import Favorite from "@/models/Favorite";
import Recipe from "@/models/Recipe";
import User from "@/models/User";
import { IRecipe } from "@/types";


// ── Obtener IDs de recetas favoritas de un usuario ───────────
/**
 * Retrieves an array of recipe IDs marked as favorite by a specific user.
 * Primarily used on client pages to highlight recipes that are already favorited.
 */
export async function getUserFavoriteIds(userId: string): Promise<string[]> {
  await connectDB();
  const favorites = await Favorite.find({ userId }).select("recipeId").lean();
  return favorites.map((fav) => fav.recipeId.toString());
}


// ── Obtener recetas favoritas completas de un usuario ────────
/**
 * Retrieves the full populated recipe objects that are favorited by a user,
 * ordered by the date they were added (newest first).
 */
export async function getUserFavorites(userId: string): Promise<IRecipe[]> {
  await connectDB();
  const favorites = await Favorite.find({ userId })
    .populate("recipeId")
    .sort({ createdAt: -1 })
    .lean();

  const recipes = favorites
    .map((fav) => fav.recipeId as unknown as IRecipe)
    .filter(Boolean);


  return JSON.parse(JSON.stringify(recipes));
}

// ── Agregar a favoritos ──────────────────────────────────────
/**
 * Associates a recipe with a user by creating a Favorite document.
 * Ensures the target recipe exists first, and uses an upsert to avoid duplicate entries.
 */
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
/**
 * Removes a recipe association from a user's favorites by deleting the matching document.
 */
export async function removeFavorite(
  userId: string,
  recipeId: string
): Promise<void> {
  await connectDB();
  await Favorite.findOneAndDelete({ userId, recipeId });
}

// ── Toggle favorito ──────────────────────────────────────────
/**
 * Toggles a recipe favorite status: removes it if it exists, or adds it if it doesn't.
 * Returns the final boolean favorite status.
 */
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

interface PopulatedFavorite {
  _id: string;
  userId?: { name: string; email: string; role?: string } | null;
  recipeId?: { name: string; image: string } | null;
  createdAt?: string | Date;
}

// ── Admin: ver todos los favoritos agrupados por usuario ─────
/**
 * Admin utility: retrieves all favorite entries across the application,
 * populated with both User details and Recipe names/images.
 * Also returns empty dummy entries for users with zero favorites to ensure
 * they appear in the administration dashboard for actions like email broadcasts.
 */
export async function getAllFavoritesWithUsers() {
  await connectDB();
  
  // 1. Obtener todos los favoritos reales con usuarios y recetas
  const dbFavorites = await Favorite.find({})
    .populate("userId", "name email role")
    .populate("recipeId", "name image")
    .sort({ createdAt: -1 })
    .lean();

  const favorites = dbFavorites as unknown as PopulatedFavorite[];

  // 2. Obtener todos los usuarios de la base de datos
  const allUsers = await User.find({}).select("name email role").lean();

  // 3. Crear un conjunto de correos electrónicos de usuarios que ya tienen favoritos
  const usersWithFavorites = new Set(
    favorites
      .map((fav) => fav.userId?.email)
      .filter(Boolean)
  );

  // 4. Agregar una entrada dummy para cada usuario sin favoritos
  const result: PopulatedFavorite[] = [...favorites];
  for (const user of allUsers) {
    if (!usersWithFavorites.has(user.email)) {
      result.push({
        _id: `dummy_${user._id}`,
        userId: {
          name: user.name,
          email: user.email,
          role: user.role || "user"
        },
        recipeId: null,
        createdAt: user.createdAt
      });
    }
  }

  return JSON.parse(JSON.stringify(result));
}



