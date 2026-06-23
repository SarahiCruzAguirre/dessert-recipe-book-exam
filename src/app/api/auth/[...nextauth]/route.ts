/**
 * SIDE: Server-side
 * Description: API route handlers for NextAuth.js authentication flow.
 * Directs incoming GET and POST auth requests (signin, signout, session checks) to NextAuth handlers.
 */

import { handlers } from "@/lib/auth";

export const { GET, POST } = handlers;

