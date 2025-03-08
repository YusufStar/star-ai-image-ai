"use client";

import type { ThemeProviderProps } from "next-themes";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { Spinner, ToastProvider } from "@heroui/react";
import { useState } from "react";
import { useEffect } from "react";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

declare module "@react-types/shared" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <HeroUIProvider navigate={router.push}>
      <NextThemesProvider
        {...themeProps}
        enableSystem
        attribute="class"
        defaultTheme="system"
      >
        {mounted ? (
          children
        ) : (
          <div className="flex items-center justify-center h-screen">
            <Spinner />
          </div>
        )}
        <ToastProvider />
      </NextThemesProvider>
    </HeroUIProvider>
  );
}
