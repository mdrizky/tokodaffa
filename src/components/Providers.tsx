"use client";

import { ThemeProvider } from "next-themes";
import { LanguageProvider } from "@/lib/i18n";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <LanguageProvider>
      <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
        {mounted ? children : <>{children}</>}
      </ThemeProvider>
    </LanguageProvider>
  );
}
