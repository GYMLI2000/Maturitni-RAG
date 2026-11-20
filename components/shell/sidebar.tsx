"use client";

import {
  BookOpen,
  ChartNoAxesColumn,
  ChevronsUpDown,
  Layers2,
  ListChecks,
  ListTodo,
  Monitor,
  Moon,
  Package,
  PanelLeft,
  Send,
  Settings,
  ShieldCheck,
  Sun,
  Upload,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useTheme } from "next-themes";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { DataIcon } from "@/components/icon";
import { useUi } from "@/components/providers";
import { editor, student, studyPackage, subjects } from "@/lib/mock/subjects";
import { cn } from "@/lib/cn";
import type { IconName } from "@/lib/types";

type NavItem = { label: string; icon: LucideIcon | IconName; href?: string; match?: (p: string) => boolean; count?: string };

const studentNav: NavItem[] = [
  { label: "Dnes", icon: Sun, href: "/", match: (p) => p === "/" },
  { label: "Předměty", icon: BookOpen, href: "/balicky", match: (p) => p.startsWith("/balicky") },
  { label: "Kartičky", icon: Layers2, href: "/karticky", match: (p) => p.startsWith("/karticky"), count: String(student.dueCards) },
  { label: "Kvízy", icon: ListChecks, href: "/kvizy/novy", match: (p) => p.startsWith("/kvizy") },
  { label: "Pokrok", icon: ChartNoAxesColumn },
];

const subjectNav: NavItem[] = subjects.map((s) => ({
  label: s.name,
  icon: s.icon,
  href: `/predmety/${s.slug}/otazky/${s.firstQuestion}`,
  match: (p) => p.startsWith(`/predmety/${s.slug}/`),
}));

const editorNav: NavItem[] = [
  { label: "Balíčky", icon: Package },
  { label: "Otázky", icon: ListTodo },
  { label: "Importy", icon: Upload, href: "/redakce/importy/24", match: (p) => p.startsWith("/redakce/importy"), count: "1" },
  { label: "Publikace", icon: Send },
  { label: "Ověřování", icon: ShieldCheck },
];

/** Sidebar: thick glass, brand and collapse button inside the panel. */
export function Sidebar({ variant = "student" }: { variant?: "student" | "editor" }) {
  const pathname = usePathname();
  const { sidebarCollapsed, setSidebarCollapsed } = useUi();
  const isEditor = variant === "editor";
  const person = isEditor ? editor : student;

  return (
    <aside
      aria-label="Postranní panel"
      hidden={sidebarCollapsed}
      className="glass-thick fixed top-2.5 bottom-2.5 left-2.5 z-30 hidden w-60 flex-col gap-0.5 overflow-y-auto rounded-[22px] p-2.5 lg:flex"
    >
      <div className="flex h-11 shrink-0 items-center pr-1 pl-2.5">
        <Link href="/" className="flex-1 text-[17px] font-semibold tracking-[-0.4px]">
          Studium
        </Link>
        <button
          type="button"
          onClick={() => setSidebarCollapsed(true)}
          aria-label="Skrýt panel"
          title="Skrýt panel"
          className="hit press flex size-8 items-center justify-center rounded-[10px] text-muted hover:bg-ring hover:text-fg"
        >
          <PanelLeft size={17} strokeWidth={1.5} aria-hidden />
        </button>
      </div>

      <Link href="/balicky" className="press flex h-12 shrink-0 items-center gap-2.5 rounded-xl bg-ring px-2.5" aria-label={`Studijní balíček: ${isEditor ? editor.workspace : studyPackage.title}. Změnit`}>
        <span className="flex flex-1 flex-col gap-px">
          <span className="text-[13px] font-semibold">{isEditor ? editor.workspace : studyPackage.title}</span>
          <span className="text-[12px] text-muted">{isEditor ? editor.school : studyPackage.label}</span>
        </span>
        <ChevronsUpDown size={14} strokeWidth={1.5} className="text-muted" aria-hidden />
      </Link>

      <nav aria-label={isEditor ? "Redakce" : "Pracovní prostor"} className="flex flex-col gap-0.5">
        <SectionLabel>{isEditor ? "Redakce" : "Pracovní prostor"}</SectionLabel>
        {(isEditor ? editorNav : studentNav).map((item) => (
          <SidebarItem key={item.label} item={item} active={!!item.match?.(pathname)} />
        ))}
        {!isEditor && (
          <>
            <SectionLabel>Moje předměty</SectionLabel>
            {subjectNav.map((item) => (
              <SidebarItem key={item.label} item={item} active={!!item.match?.(pathname)} />
            ))}
          </>
        )}
      </nav>

      <div className="min-h-4 flex-1" />

      <div className="flex h-[52px] shrink-0 items-center gap-2.5 rounded-xl px-2">
        <span className="mesh-hero flex size-8 items-center justify-center rounded-full text-[12px] font-semibold text-white" aria-hidden>
          {person.initials}
        </span>
        <span className="flex flex-1 flex-col gap-px">
          <span className="text-[13px] font-semibold">{person.name}</span>
          <span className="text-[12px] text-muted">{person.role}</span>
        </span>
        <SettingsMenu />
      </div>
    </aside>
  );
}

function SectionLabel({ children }: { children: ReactNode }) {
  return <p className="px-2.5 pt-[18px] pb-1.5 text-[12px] font-medium text-muted">{children}</p>;
}

function SidebarItem({ item, active }: { item: NavItem; active: boolean }) {
  const icon =
    typeof item.icon === "string" ? (
      <DataIcon name={item.icon} size={16} className={active ? "text-accent" : "text-muted"} />
    ) : (
      <item.icon size={16} strokeWidth={active ? 2 : 1.5} className={active ? "text-accent" : "text-muted"} aria-hidden />
    );
  const cls = cn(
    "flex h-9 shrink-0 items-center gap-2.5 rounded-xl px-2.5 text-[14px]",
    active ? "raised font-semibold" : "font-medium",
  );
  const body = (
    <>
      {icon}
      <span className="flex-1">{item.label}</span>
      {item.count && <span className="tnum text-[12px] font-medium text-muted">{item.count}</span>}
    </>
  );
  if (!item.href) {
    // Not designed yet: visible but inert.
    return (
      <span aria-disabled="true" title="Připravujeme" className={cn(cls, "cursor-default")}>
        {body}
      </span>
    );
  }
  return (
    <Link href={item.href} aria-current={active ? "page" : undefined} className={cn(cls, !active && "hover:bg-ring")}>
      {body}
    </Link>
  );
}

const themes = [
  { value: "light", label: "Světlý", icon: Sun },
  { value: "dark", label: "Tmavý", icon: Moon },
  { value: "system", label: "Podle systému", icon: Monitor },
] as const;

/** Settings: appearance menu. Solid (no glass on glass), opens from its trigger. */
export function SettingsMenu({ placement = "up" }: { placement?: "up" | "down" }) {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const reduce = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => !ref.current?.contains(e.target as Node) && setOpen(false);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label="Nastavení vzhledu"
        title="Nastavení vzhledu"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="hit press flex size-8 items-center justify-center rounded-[10px] text-muted hover:bg-ring hover:text-fg"
      >
        <Settings size={16} strokeWidth={1.5} aria-hidden />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="Vzhled"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
            style={{ transformOrigin: placement === "up" ? "100% 100%" : "100% 0%" }}
            className={cn(
              "solid absolute right-0 z-40 w-48 rounded-[14px] p-1 shadow-[0_10px_30px_var(--glass-shadow)]",
              placement === "up" ? "bottom-10" : "top-10",
            )}
          >
            <p className="px-2.5 pt-1.5 pb-1 text-[12px] font-medium text-muted">Vzhled</p>
            {themes.map((t) => (
              <button
                key={t.value}
                type="button"
                role="menuitemradio"
                aria-checked={theme === t.value}
                onClick={() => {
                  setTheme(t.value);
                  setOpen(false);
                }}
                className={cn("flex h-9 w-full items-center gap-2.5 rounded-[10px] px-2.5 text-[14px] font-medium hover:bg-hover", theme === t.value && "text-accent")}
              >
                <t.icon size={16} strokeWidth={1.5} aria-hidden />
                {t.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
