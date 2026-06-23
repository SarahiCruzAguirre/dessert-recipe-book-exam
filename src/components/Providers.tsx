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
