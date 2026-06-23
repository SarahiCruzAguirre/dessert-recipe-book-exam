/**
 * SIDE: Server-side
 * Description: Mongoose database schema and interface definition for Recipe documents.
 * Represents a recipe containing cooking instructions, difficulty levels, and metadata.
 */

import mongoose, { Document, Schema } from "mongoose";

/**
 * Interface representing a Recipe document in the database.
 */
export interface IRecipeDocument extends Document {
  name: string;
  image: string;
  prepTime: number;
  difficulty: "Fácil" | "Medio" | "Difícil";
  description: string;
  servings: number;
  ingredients: string[];
  steps: string[];
  category: string;
  createdAt: Date;
}

/**
 * Schema definition for the Recipe collection.
 */
const RecipeSchema = new Schema<IRecipeDocument>(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    image: {
      type: String,
      required: [true, "La imagen es obligatoria"],
    },
    prepTime: {
      type: Number,
      required: [true, "El tiempo de preparación es obligatorio"],
      min: [1, "El tiempo mínimo es 1 minuto"],
    },
    difficulty: {
      type: String,
      enum: ["Fácil", "Medio", "Difícil"],
      required: [true, "La dificultad es obligatoria"],
    },
    description: {
      type: String,
      required: [true, "La descripción es obligatoria"],
    },
    servings: {
      type: Number,
      required: [true, "Las porciones son obligatorias"],
      min: [1, "Mínimo 1 porción"],
    },
    ingredients: {
      type: [String],
      required: [true, "Los ingredientes son obligatorios"],
    },
    steps: {
      type: [String],
      required: [true, "Los pasos son obligatorios"],
    },
    category: {
      type: String,
      required: [true, "La categoría es obligatoria"],
      trim: true,
    },
  },
  { timestamps: true }
);

const Recipe =
  mongoose.models.Recipe ||
  mongoose.model<IRecipeDocument>("Recipe", RecipeSchema);

export default Recipe;

