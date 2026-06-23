import nodemailer from "nodemailer";

// Helper to strip any surrounding single or double quotes from environment variables
function cleanEnv(key: string): string {
  const val = process.env[key] || "";
  return val.replace(/^['"]|['"]$/g, "").trim();
}

// ── Transporter (singleton) ──────────────────────────────────
function createTransporter() {
  const emailUser = cleanEnv("EMAIL_USER");
  const emailPassword = cleanEnv("EMAIL_PASSWORD");
  const clientId = cleanEnv("GCLOUD_CLIENT_ID");
  const clientSecret = cleanEnv("GCLOUD_CLIENT_SECRET");
  const refreshToken = cleanEnv("GCLOUD_REFRESH_TOKEN");

  // Si está definido EMAIL_PASSWORD (Contraseña de Aplicación), lo preferimos por estabilidad y simplicidad
  if (emailPassword) {
    console.log(`[EmailService] Using app password auth for: ${emailUser}`);
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPassword,
      },
    });
  }

  if (clientId && clientSecret && refreshToken) {
    console.log(`[EmailService] Using OAuth2 auth for: ${emailUser}`);
    return nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: emailUser,
        clientId: clientId,
        clientSecret: clientSecret,
        refreshToken: refreshToken,
      },
    });
  }

  console.warn("[EmailService] No valid SMTP credentials found. Falling back to default empty password.");
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: emailUser,
      pass: "",
    },
  });
}

// ── Template base ────────────────────────────────────────────
function baseTemplate(content: string): string {
  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <style>
        body { margin: 0; font-family: 'Helvetica Neue', Arial, sans-serif; background: #f2efea; color: #3e3a36; }
        .wrapper { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
        .header { text-align: center; padding: 30px 0; border-bottom: 2px solid #e5ded4; }
        .logo { font-size: 28px; font-weight: 700; color: #3e3a36; letter-spacing: 0.5px; }
        .logo span { color: #0725b0; }
        .content { padding: 36px 0; text-align: left; }
        h1 { font-size: 24px; color: #0725b0; margin: 0 0 16px; }
        p { color: #3e3a36; opacity: 0.85; line-height: 1.7; margin: 0 0 14px; }
        .cta { display: inline-block; margin: 24px 0; padding: 14px 32px; background: #0725b0; color: #f2efea; font-weight: 700; text-decoration: none; border-radius: 12px; font-size: 15px; }
        .footer { text-align: center; padding: 20px 0; border-top: 2px solid #e5ded4; font-size: 12px; color: #6b4a3a; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <div class="logo">Crumb<span>Club</span></div>
        </div>
        <div class="content">${content}</div>
        <div class="footer">
          © ${new Date().getFullYear()} Crumb Club · Con amor y azúcar
        </div>
      </div>
    </body>
    </html>
  `;
}

// ── Email de bienvenida ──────────────────────────────────────
export async function sendWelcomeEmail(
  to: string,
  name: string
): Promise<void> {
  const transporter = createTransporter();
  const fromAddress = cleanEnv("EMAIL_FROM") || cleanEnv("EMAIL_USER") || '"Crumb Club" <noreply@crumbclub.com>';
  const nextAuthUrl = cleanEnv("NEXTAUTH_URL") || "http://localhost:3000";

  const html = baseTemplate(`
    <h1>¡Bienvenido/a, ${name}! 🧁</h1>
    <p>Tu cuenta en <strong>Crumb Club</strong> ha sido creada exitosamente.</p>
    <p>Ahora puedes explorar nuestro dulce catálogo de recetas, guardar tus favoritas y descubrir nuevos postres y cafés cada día.</p>
    <a href="${nextAuthUrl}" class="cta">Ver recetas</a>
    <p>Si no creaste esta cuenta, ignora este mensaje.</p>
  `);

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject: "¡Bienvenido/a a Crumb Club! 🧁",
    html,
  });
}

// ── Email manual (admin) ─────────────────────────────────────
export async function sendCustomEmail(
  to: string,
  subject: string,
  message: string,
  recipientName: string
): Promise<void> {
  const transporter = createTransporter();
  const fromAddress = cleanEnv("EMAIL_FROM") || cleanEnv("EMAIL_USER") || '"Crumb Club" <noreply@crumbclub.com>';
  const nextAuthUrl = cleanEnv("NEXTAUTH_URL") || "http://localhost:3000";

  const html = baseTemplate(`
    <h1>${subject}</h1>
    <p>Hola <strong>${recipientName}</strong>,</p>
    ${message
      .split("\n")
      .map((line) => `<p>${line}</p>`)
      .join("")}
    <a href="${nextAuthUrl}" class="cta">Ir a Crumb Club</a>
  `);

  await transporter.sendMail({
    from: fromAddress,
    to,
    subject,
    html,
  });
}
