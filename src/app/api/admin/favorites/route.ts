import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFavoritesWithUsers } from "@/services/favorite.service";
import { ApiResponse } from "@/types";

export async function GET() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Acceso denegado" },
      { status: 403 }
    );
  }

  try {
    const data = await getAllFavoritesWithUsers();
    return NextResponse.json<ApiResponse>({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
