/**
 * SIDE: Server-side
 * Description: Mongoose database schema and interface for Favorite documents.
 * Handles the mapping between User IDs and Recipe IDs with a unique compound index.
 */

import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing the structure of a Favorite document in the database.
 */
export interface IFavoriteDocument extends Document {
  userId: mongoose.Types.ObjectId;
  recipeId: mongoose.Types.ObjectId;
  createdAt: Date;
}

/**
 * Favorite Schema defining the relationship between User and Recipe.
 */
const FavoriteSchema = new Schema<IFavoriteDocument>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "El userId es obligatorio"],
    },
    recipeId: {
      type: Schema.Types.ObjectId,
      ref: "Recipe",
      required: [true, "El recipeId es obligatorio"],
    },
  },
  { timestamps: true }
);

// Índice único: un usuario no puede tener la misma receta dos veces en favoritos
FavoriteSchema.index({ userId: 1, recipeId: 1 }, { unique: true });

const Favorite =
  mongoose.models.Favorite ||
  mongoose.model<IFavoriteDocument>("Favorite", FavoriteSchema);

export default Favorite;

