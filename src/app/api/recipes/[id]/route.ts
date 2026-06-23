/**
 * SIDE: Server-side
 * Description: API route handler to fetch the details of a single recipe by ID.
 */

import { NextRequest, NextResponse } from "next/server";
import { getRecipeById } from "@/services/recipe.service";
import { ApiResponse, IRecipe } from "@/types";

/**
 * Handles GET requests to retrieve a single recipe.
 * Extracts the recipe ID parameter from route params.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const recipe = await getRecipeById(id);

    if (!recipe) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Receta no encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse<IRecipe>>({
      success: true,
      data: recipe,
    });
  } catch {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Error al obtener la receta" },
      { status: 500 }
    );
  }
}

