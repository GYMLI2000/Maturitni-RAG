import {
  Atom,
  BookOpen,
  CalendarRange,
  Dna,
  Landmark,
  Languages,
  LockOpen,
  Radical,
  School,
  type LucideIcon,
  type LucideProps,
} from "lucide-react";
import type { IconName } from "@/lib/types";

const icons: Record<IconName, LucideIcon> = {
  landmark: Landmark,
  radical: Radical,
  languages: Languages,
  "book-open": BookOpen,
  "calendar-range": CalendarRange,
  atom: Atom,
  dna: Dna,
  school: School,
  "lock-open": LockOpen,
};

/** Data-driven icon. Outline, 1.5px stroke next to regular text. */
export function DataIcon({ name, ...props }: { name: IconName } & LucideProps) {
  const Icon = icons[name];
  return <Icon strokeWidth={1.5} aria-hidden {...props} />;
}
