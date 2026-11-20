"use client";

import { BookOpen, ChartNoAxesColumn, Layers2, PanelLeft, Search, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { GlassIconButton } from "@/components/ui/buttons";
import { useUi } from "@/components/providers";
import { Sidebar } from "@/components/shell/sidebar";
import { cn } from "@/lib/cn";

/** Sidebar (≥1024px) or the floating tab bar (below), around the page content. */
export function AppShell({ variant = "student", children }: { variant?: "student" | "editor"; children: ReactNode }) {
  const { sidebarCollapsed, setSidebarCollapsed } = useUi();
  return (
    <>
      <Sidebar variant={variant} />
      {sidebarCollapsed && (
        <div className="fixed top-[22px] left-2.5 z-30 hidden lg:block">
          <GlassIconButton icon={PanelLeft} label="Zobrazit panel" onClick={() => setSidebarCollapsed(false)} />
        </div>
      )}
      <main id="obsah" className={cn("min-h-dvh pb-32 lg:pb-0", sidebarCollapsed ? "lg:pl-[50px]" : "lg:pl-[250px]")}>{children}</main>
      {variant === "student" && <MobileTabBar />}
    </>
  );
}

/** Floating bar at the top of a page. Shows a scroll edge (gradient, not a line) once content moves under it. */
export function TopBar({ children, className }: { children: ReactNode; className?: string }) {
  const scrolled = useScrolled();
  return (
    <>
      <div
        aria-hidden
        className={cn(
          "pointer-events-none fixed inset-x-0 top-0 z-10 h-24 bg-linear-to-b from-(--bg-d) from-40% to-transparent transition-opacity duration-200",
          scrolled ? "opacity-100" : "opacity-0",
        )}
      />
      <div className={cn("sticky top-3 z-20 flex h-11 items-center gap-2 lg:top-[22px] lg:h-10", className)}>{children}</div>
    </>
  );
}

function useScrolled() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 4);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return scrolled;
}

const tabs = [
  { label: "Dnes", icon: Sun, href: "/", match: (p: string) => p === "/" },
  { label: "Předměty", icon: BookOpen, href: "/balicky", match: (p: string) => p.startsWith("/predmety") || p.startsWith("/balicky") },
  { label: "Kartičky", icon: Layers2, href: "/karticky", match: (p: string) => p.startsWith("/karticky") },
  { label: "Pokrok", icon: ChartNoAxesColumn },
];

/** MobileTabBar: floating glass capsule plus a separate round search button. */
export function MobileTabBar() {
  const pathname = usePathname();
  const { openCommand } = useUi();
  return (
    <>
      <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-20 h-36 bg-linear-to-b from-transparent to-(--bg-d) to-75% lg:hidden" />
      <div className="fixed right-3 bottom-[max(20px,env(safe-area-inset-bottom))] left-4 z-30 flex items-center gap-2 lg:hidden">
        <nav aria-label="Hlavní navigace" className="glass flex h-[62px] flex-1 items-center rounded-full p-1 [--g-blur:30px] [--g-b:30px]">
          {tabs.map((t) => {
            const active = !!t.match?.(pathname);
            const cls = cn(
              "flex h-[54px] flex-1 flex-col items-center justify-center gap-0.5 rounded-full text-[10px] font-semibold",
              active ? "bg-ring text-accent" : "text-fg",
            );
            const body = (
              <>
                <t.icon size={22} strokeWidth={active ? 2 : 1.5} aria-hidden />
                {t.label}
              </>
            );
            return t.href ? (
              <Link key={t.label} href={t.href} aria-current={active ? "page" : undefined} className={cls}>
                {body}
              </Link>
            ) : (
              <span key={t.label} aria-disabled="true" title="Připravujeme" className={cls}>
                {body}
              </span>
            );
          })}
        </nav>
        <button
          type="button"
          onClick={openCommand}
          aria-label="Hledat"
          className="glass press flex size-[62px] items-center justify-center rounded-full text-fg [--g-blur:30px] [--g-b:30px]"
        >
          <Search size={22} strokeWidth={1.5} aria-hidden />
        </button>
      </div>
    </>
  );
}
