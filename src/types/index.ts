// ─── Usuario ────────────────────────────────────────────────
export interface IUser {
  _id: string;
  name: string;
  email: string;
  password?: string;
  role: "user" | "admin";
  createdAt: Date;
}

// ─── Receta ─────────────────────────────────────────────────
export interface IRecipe {
  _id: string;
  name: string;
  image: string;
  prepTime: number;        // minutos
  difficulty: "Fácil" | "Medio" | "Difícil";
  description: string;
  // Campos solo visibles en detalle
  servings: number;
  ingredients: string[];
  steps: string[];
  category: string;
  createdAt: Date;
}

// ─── Favorito ───────────────────────────────────────────────
export interface IFavorite {
  _id: string;
  userId: string;
  recipeId: string;
  recipe?: IRecipe;
  createdAt: Date;
}

// ─── Props de RecipeCard ────────────────────────────────────
export interface RecipeCardProps {
  recipe: IRecipe;
  isFavorite?: boolean;
  onToggleFavorite?: (recipeId: string) => void;
}

// ─── Respuesta de API ───────────────────────────────────────
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// ─── Session user (NextAuth) ────────────────────────────────
export interface SessionUser {
  id: string;
  name: string;
  email: string;
  role: "user" | "admin";
}
