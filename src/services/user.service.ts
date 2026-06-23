import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { sendWelcomeEmail } from "@/services/email.service";
import { IUser } from "@/types";

interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

// ── Registrar nuevo usuario ──────────────────────────────────
export async function registerUser(
  input: RegisterInput
): Promise<{ user: IUser; message: string }> {
  await connectDB();

  // Verificar si ya existe
  const existing = await User.findOne({ email: input.email.toLowerCase() });
  if (existing) {
    throw new Error("Ya existe una cuenta con ese email");
  }

  // Hash de contraseña
  const hashedPassword = await bcrypt.hash(input.password, 12);

  // Verificar si debe ser admin
  const role =
    input.email.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase()
      ? "admin"
      : "user";

  const user = await User.create({
    name: input.name.trim(),
    email: input.email.toLowerCase().trim(),
    password: hashedPassword,
    role,
  });

  // Enviar email de bienvenida (no bloqueante)
  sendWelcomeEmail(user.email, user.name).catch((err) =>
    console.error("Error enviando email de bienvenida:", err)
  );

  const userObj: IUser = {
    _id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };

  return { user: userObj, message: "Usuario registrado exitosamente" };
}

// ── Obtener todos los usuarios (solo admin) ──────────────────
export async function getAllUsers(): Promise<IUser[]> {
  await connectDB();
  const users = await User.find({})
    .select("-password")
    .sort({ createdAt: -1 })
    .lean();
  return JSON.parse(JSON.stringify(users));
}

// ── Obtener usuario por email ────────────────────────────────
export async function getUserByEmail(email: string): Promise<IUser | null> {
  await connectDB();
  const user = await User.findOne({ email }).select("-password").lean();
  if (!user) return null;
  return JSON.parse(JSON.stringify(user));
}
