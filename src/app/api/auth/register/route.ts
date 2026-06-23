import { NextRequest, NextResponse } from "next/server";
import { registerUser } from "@/services/user.service";
import { ApiResponse } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "La contraseña debe tener al menos 6 caracteres" },
        { status: 400 }
      );
    }

    const result = await registerUser({ name, email, password });

    return NextResponse.json<ApiResponse>(
      { success: true, data: result.user, message: result.message },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Error al registrar usuario";
    const status = message.includes("Ya existe") ? 409 : 500;
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status }
    );
  }
}
