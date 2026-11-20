"use client";

import { BookOpen, ChevronsUpDown, Clock3, Landmark, ListChecks, ShieldCheck, X, type LucideIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState } from "react";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { Segmented } from "@/components/ui/segmented";
import { quizSetup, quizzes } from "@/lib/mock/study";
import { plural } from "@/lib/plural";

/** Frame 30. */
export function QuizSetup() {
  const router = useRouter();
  const [subject, setSubject] = useState("dejepis");
  const [count, setCount] = useState<(typeof quizSetup.counts)[number]>("8");
  const topics = subject === "dejepis" ? quizSetup.topics : [];
  const [topic, setTopic] = useState(quizSetup.topics[0].value);
  const quiz = topics.length ? quizzes.find((q) => q.id === topic) : undefined;
  const available = quiz?.questions.length ?? 0;
  const n = count === "Vše" ? available : Math.min(Number(count), available);
  const minutes = Math.max(1, Math.round(n / 2));

  return (
    <>
      <FocusBar
        left={<GlassIconButton href="/" icon={X} label="Zavřít" size={44} />}
        center={
          <div className={capsule}>
            <ListChecks size={16} strokeWidth={2} aria-hidden />
            <span className="font-semibold">Nový kvíz</span>
          </div>
        }
      />
      <form
        className="flex w-full flex-1 flex-col items-center justify-center gap-7 py-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (n) router.push(`/kvizy/${topic}?pocet=${n}`);
        }}
      >
        <section aria-labelledby="nastaveni" className="surface flex w-full max-w-[640px] flex-col rounded-[30px] px-5 pt-8 pb-7 lg:px-10 lg:pt-10 lg:pb-8">
          <h1 id="nastaveni" className="text-[28px] font-semibold tracking-[-0.8px] lg:text-[32px] lg:tracking-[-0.9px]">
            Nastavení kvízu
          </h1>
          <p className="mt-2 text-[16px] text-muted">Vyber si téma ze studijního balíčku.</p>
          <Select label="Předmět" icon={Landmark} value={subject} onChange={setSubject} options={quizSetup.subjects} className="mt-7" />
          <Select
            label="Téma"
            icon={BookOpen}
            value={topics.length ? topic : ""}
            onChange={setTopic}
            options={topics.length ? topics : [{ value: "", label: "Zatím žádné schválené téma" }]}
            className="mt-[18px]"
          />
          <div className="mt-[18px] flex flex-col gap-2">
            <p className="text-[13px] font-semibold" id="pocet">
              Počet otázek
            </p>
            <Segmented label="Počet otázek" material="solid" value={count} onChange={(v) => setCount(v as typeof count)} items={quizSetup.counts.map((c) => ({ label: c, value: c }))} />
          </div>
          <div className="mt-6 flex items-center gap-3 rounded-2xl bg-soft px-4 py-3.5" aria-live="polite">
            <ShieldCheck size={18} strokeWidth={1.75} className="shrink-0 text-accent" aria-hidden />
            <div className="flex flex-col gap-0.5">
              <p className="tnum text-[14px] font-semibold">{plural(n, "schválená otázka", "schválené otázky", "schválených otázek")}</p>
              <p className="text-[13px] text-muted">Jedna správná odpověď v každé otázce. Vyhodnocení podle klíče, ne AI.</p>
            </div>
          </div>
        </section>
        <ActionBar label="Spuštění">
          <span className="flex flex-1 items-center gap-1.5 pl-3 text-[13px] text-muted lg:pl-0">
            <Clock3 size={15} strokeWidth={1.5} aria-hidden />
            Asi {plural(minutes, "minuta", "minuty", "minut")}
          </span>
          <PrimaryPill type="submit" arrow size={44} disabled={!n}>
            Spustit kvíz
          </PrimaryPill>
        </ActionBar>
      </form>
    </>
  );
}

function Select({
  label,
  icon: Icon,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  className?: string;
}) {
  const id = useId();
  return (
    <div className={`flex flex-col gap-2 ${className ?? ""}`}>
      <label htmlFor={id} className="text-[13px] font-semibold">
        {label}
      </label>
      <span className="relative">
        <Icon size={18} strokeWidth={1.5} className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" aria-hidden />
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={options.length < 2 && !options[0]?.value}
          className="h-[52px] w-full appearance-none rounded-2xl bg-panel pr-10 pl-[46px] text-[16px] font-medium text-fg shadow-[inset_0_0_0_1px_var(--ring-strong)] outline-none focus-visible:shadow-[inset_0_0_0_2px_var(--accent)] disabled:text-muted"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronsUpDown size={15} strokeWidth={1.5} className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-muted" aria-hidden />
      </span>
    </div>
  );
}
