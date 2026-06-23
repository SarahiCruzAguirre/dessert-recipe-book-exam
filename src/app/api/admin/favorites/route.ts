/**
 * SIDE: Server-side
 * Description: Admin API route handler to fetch all favorites aggregated by user.
 * Confirms that the caller is authenticated as an administrator before querying the database.
 */

import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getAllFavoritesWithUsers } from "@/services/favorite.service";
import { ApiResponse } from "@/types";

/**
 * Handles GET requests to retrieve all favorites globally across the app.
 */
export async function GET() {
  const session = await auth();

  // Validate admin authorization status from session
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

