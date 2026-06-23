import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getUserFavorites,
  getUserFavoriteIds,
  toggleFavorite,
} from "@/services/favorite.service";
import { ApiResponse } from "@/types";

// GET /api/favorites → recetas favoritas del usuario
export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { searchParams } = new URL(req.url);
    const idsOnly = searchParams.get("idsOnly") === "true";

    if (idsOnly) {
      const ids = await getUserFavoriteIds(session.user.id);
      return NextResponse.json<ApiResponse<string[]>>({ success: true, data: ids });
    }

    const favorites = await getUserFavorites(session.user.id);
    return NextResponse.json<ApiResponse>({ success: true, data: favorites });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

// POST /api/favorites → toggle favorito
export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "No autenticado" },
      { status: 401 }
    );
  }

  try {
    const { recipeId } = await req.json();
    if (!recipeId) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "recipeId es requerido" },
        { status: 400 }
      );
    }

    const result = await toggleFavorite(session.user.id, recipeId);
    return NextResponse.json<ApiResponse>({ success: true, data: result });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
