/**
 * SIDE: Server-side
 * Description: API route handler to fetch the list of recipes.
 * Automatically runs the seed service first to ensure the database has initial data.
 */

import { NextResponse } from "next/server";
import { getAllRecipes, seedRecipes } from "@/services/recipe.service";
import { ApiResponse, IRecipe } from "@/types";

/**
 * Handles GET requests to retrieve the list of all recipes.
 */
export async function GET() {
  try {
    // Seed automático si no hay recetas
    await seedRecipes();
    const recipes = await getAllRecipes();
    return NextResponse.json<ApiResponse<IRecipe[]>>({
      success: true,
      data: recipes,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al obtener recetas";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

