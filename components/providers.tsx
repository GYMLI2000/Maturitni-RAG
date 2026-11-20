"use client";

import { ThemeProvider } from "next-themes";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";
import { CommandMenu } from "@/components/command-menu";

type Ui = {
  openCommand: () => void;
  sidebarCollapsed: boolean;
  setSidebarCollapsed: (v: boolean) => void;
};

const UiContext = createContext<Ui | null>(null);

export function useUi() {
  const ctx = useContext(UiContext);
  if (!ctx) throw new Error("useUi must be used inside <Providers>");
  return ctx;
}

export function Providers({ children }: { children: ReactNode }) {
  const [commandOpen, setCommandOpen] = useState(false);
  // Opened from the keyboard: no animation.
  const [viaKeyboard, setViaKeyboard] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const openCommand = useCallback(() => {
    setViaKeyboard(false);
    setCommandOpen(true);
  }, []);

  // Global ⌘K / Ctrl+K.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setViaKeyboard(true);
        setCommandOpen((o) => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <UiContext.Provider value={{ openCommand, sidebarCollapsed, setSidebarCollapsed }}>
        {children}
        <CommandMenu open={commandOpen} instant={viaKeyboard} onClose={() => setCommandOpen(false)} />
      </UiContext.Provider>
    </ThemeProvider>
  );
}
