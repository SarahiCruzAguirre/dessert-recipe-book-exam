/**
 * SIDE: Client-side
 * Description: Application wrapper context providers.
 * Combines next-auth SessionProvider and application local I18nProvider context for client consumption.
 */

"use client";

import { SessionProvider } from "next-auth/react";
import { I18nProvider } from "@/context/I18nContext";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <I18nProvider>
      <SessionProvider>{children}</SessionProvider>
    </I18nProvider>
  );
}

