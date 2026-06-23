/**
 * SIDE: Server-side
 * Description: Admin API route handler to send emails.
 * Restricts access to authenticated administrators only, validating session role before sending.
 */

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendCustomEmail, sendWelcomeEmail } from "@/services/email.service";
import { ApiResponse } from "@/types";

/**
 * Handles POST requests to send a customized or welcome email to a specified recipient.
 */
export async function POST(req: NextRequest) {
  const session = await auth();

  // Validate admin authorization status from session
  if (!session?.user || session.user.role !== "admin") {
    return NextResponse.json<ApiResponse>(
      { success: false, error: "Acceso denegado" },
      { status: 403 }
    );
  }

  try {
    const body = await req.json();
    const { to, recipientName, subject, message, type } = body;

    if (!to || !recipientName) {
      return NextResponse.json<ApiResponse>(
        { success: false, error: "Destinatario requerido" },
        { status: 400 }
      );
    }

    if (type === "welcome") {
      await sendWelcomeEmail(to, recipientName);
    } else {
      if (!subject || !message) {
        return NextResponse.json<ApiResponse>(
          { success: false, error: "Asunto y mensaje son requeridos" },
          { status: 400 }
        );
      }
      await sendCustomEmail(to, subject, message, recipientName);
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Correo enviado exitosamente",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Error al enviar correo";
    return NextResponse.json<ApiResponse>(
      { success: false, error: message },
      { status: 500 }
    );
  }
}

