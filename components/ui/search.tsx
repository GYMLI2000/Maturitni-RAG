"use client";

import { Search } from "lucide-react";
import { useUi } from "@/components/providers";
import { cn } from "@/lib/cn";

/** GlassSearch: opens the command menu (⌘K). Optionally a real filter input when `onChange` is given. */
export function GlassSearch({
  placeholder = "Hledat otázky a pojmy",
  className,
  value,
  onChange,
}: {
  placeholder?: string;
  className?: string;
  value?: string;
  onChange?: (v: string) => void;
}) {
  const { openCommand } = useUi();
  const base = cn("glass-thin flex h-10 w-[260px] items-center gap-2 rounded-full pr-2 pl-3.5 text-[14px] tracking-[-0.1px]", className);

  if (onChange) {
    return (
      <label className={base}>
        <Search size={16} strokeWidth={1.75} className="shrink-0 text-muted" aria-hidden />
        <input
          type="search"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-full min-w-0 flex-1 bg-transparent text-fg outline-none placeholder:text-muted [&::-webkit-search-cancel-button]:hidden"
        />
      </label>
    );
  }

  return (
    <button type="button" onClick={openCommand} aria-keyshortcuts="Meta+K" className={cn(base, "press text-left text-muted")}>
      <Search size={16} strokeWidth={1.75} className="shrink-0" aria-hidden />
      <span className="flex-1 truncate">{placeholder}</span>
      <kbd className="flex h-6 items-center rounded-full bg-ring px-2 text-[11px] font-medium">⌘K</kbd>
    </button>
  );
}
