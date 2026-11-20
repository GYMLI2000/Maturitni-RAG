"use client";

import { CornerDownLeft, RotateCcw, Timer, X } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { DoneCard } from "@/components/done-card";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { CitationChip, Kbd, ProgressDots } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { OptionRow, type OptionState } from "@/components/ui/option-row";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { Quiz, QuizOption } from "@/lib/types";

type Key = QuizOption["key"];
const KEYS: Key[] = ["A", "B", "C", "D"];

function useElapsed(running: boolean) {
  const [s, setS] = useState(0);
  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => setS((x) => x + 1), 1000);
    return () => clearInterval(t);
  }, [running]);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

/** Question → evaluation (frames 23 and 31). Keys A–D pick an answer, Enter confirms. */
export function QuizView({ quiz }: { quiz: Quiz }) {
  // Question count chosen in /kvizy/novy (?pocet=5).
  const requested = Number(useSearchParams().get("pocet"));
  const count = requested > 0 ? Math.min(requested, quiz.questions.length) : quiz.questions.length;
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<Key | null>(null);
  const [checked, setChecked] = useState(false);
  const [results, setResults] = useState<("ok" | "bad" | undefined)[]>([]);
  const done = index >= count;
  const time = useElapsed(!done);
  const q = quiz.questions[Math.min(index, count - 1)];

  const confirm = useCallback(() => {
    if (!picked) return;
    setChecked(true);
    setResults((r) => {
      const next = [...r];
      next[index] = picked === q.correct ? "ok" : "bad";
      return next;
    });
  }, [picked, q, index]);

  const next = useCallback(() => {
    setIndex((i) => i + 1);
    setPicked(null);
    setChecked(false);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input:not([type=radio]),textarea,select")) return;
      const k = e.key.toUpperCase() as Key;
      if (!checked && KEYS.includes(k)) {
        e.preventDefault();
        setPicked(k);
      } else if (e.key === "Enter" && !(e.target as HTMLElement).closest("a,button")) {
        e.preventDefault();
        if (checked) next();
        else confirm();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [checked, confirm, next, done]);

  const correctCount = results.filter((r) => r === "ok").length;

  const optionState = (key: Key): OptionState => {
    if (!checked) return picked === key ? "selected" : "idle";
    if (key === q.correct) return "correct";
    if (key === picked) return "wrong";
    return "dimmed";
  };

  return (
    <>
      <FocusBar
        left={<GlassIconButton href="/" icon={X} label="Ukončit kvíz" size={44} />}
        center={
          <div className={cn(capsule, "gap-3.5 px-[18px]")}>
            <span className="hidden truncate font-semibold sm:inline">{quiz.title}</span>
            <ProgressDots total={count} current={Math.min(index, count - 1)} results={results} />
            <span className="tnum font-medium text-muted">
              {Math.min(index + 1, count)} / {count}
            </span>
          </div>
        }
        right={
          <span className="hidden sm:contents">
            <div className={cn(capsule, "gap-2 pr-4")}>
              <Timer size={16} strokeWidth={1.5} className="text-muted" aria-hidden />
              <span className="tnum font-semibold" aria-label={`Čas ${time}`}>
                {time}
              </span>
            </div>
          </span>
        }
      />

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-7 py-6">
        {done ? (
          <DoneCard
            title="Kvíz máš hotový"
            text={`Správně ${plural(correctCount, "odpověď", "odpovědi", "odpovědí")} z ${count}.`}
            stats={[
              { value: count, label: "otázek" },
              { value: correctCount, label: "správně", tone: "success" },
              { value: count - correctCount, label: "zopakovat", tone: "warning" },
            ]}
            actions={
              <>
                <PrimaryPill href="/balicky" arrow size={44}>
                  Procházet předměty
                </PrimaryPill>
                <GlassButton
                  icon={RotateCcw}
                  variant="solid"
                  size={44}
                  onClick={() => {
                    setIndex(0);
                    setResults([]);
                    setPicked(null);
                    setChecked(false);
                  }}
                >
                  Projít znovu
                </GlassButton>
              </>
            }
          />
        ) : (
          <>
            <fieldset className="surface w-full max-w-[700px] rounded-[30px] px-5 pt-8 pb-7 lg:px-11 lg:pt-11 lg:pb-10">
              <p className={cn("text-[13px] font-semibold", !checked ? "text-accent" : results[index] === "ok" ? "text-success" : "text-error")}>
                Otázka {index + 1}
              </p>
              <legend className="contents">
                <h1 className="mt-3 text-[24px] leading-[1.2] font-semibold tracking-[-0.6px] lg:text-[30px] lg:tracking-[-0.8px]">{q.text}</h1>
              </legend>
              <p className="mt-3 text-[14px] text-muted" aria-live="polite">
                {!checked
                  ? "Vyber jednu možnost"
                  : results[index] === "ok"
                    ? "Správně. Odpověď byla potvrzena."
                    : `Nesprávně. Správná odpověď je ${q.correct}.`}
              </p>
              <div className="mt-7 flex flex-col gap-2.5">
                {q.options.map((o) => (
                  <OptionRow
                    key={o.key}
                    name={`otazka-${index}`}
                    value={o.key}
                    label={o.text}
                    state={optionState(o.key)}
                    disabled={checked}
                    onSelect={() => setPicked(o.key)}
                  />
                ))}
              </div>
              {checked && (
                <div className="mt-5 flex flex-col gap-3 border-t border-border pt-[18px]">
                  <p className="text-[13px] font-semibold text-muted">Proč</p>
                  <p className="text-[16px] leading-[1.55]">{q.why}</p>
                  <CitationChip n={1} label={q.citation} href="/predmety/dejepis/otazky/7/studium#zdroj-1" />
                </div>
              )}
            </fieldset>

            <ActionBar label="Odpověď">
              {checked ? (
                <span className="pl-3 text-[14px] font-medium text-muted lg:pl-0">Vyhodnoceno podle klíče</span>
              ) : (
                <button type="button" onClick={next} className="hit pl-3 text-[14px] font-medium text-muted hover:text-fg lg:pl-0">
                  Přeskočit
                </button>
              )}
              <div className="flex-1" />
              <span className="hidden items-center gap-1.5 text-[12px] font-medium text-muted sm:flex">
                <Kbd>
                  <CornerDownLeft size={12} strokeWidth={2} aria-label="Enter" />
                </Kbd>
                {checked ? "další" : "potvrdit"}
              </span>
              {checked ? (
                <PrimaryPill onClick={next} arrow size={44} className="pr-4 pl-5">
                  {index + 1 === count ? "Dokončit kvíz" : "Další otázka"}
                </PrimaryPill>
              ) : (
                <PrimaryPill onClick={confirm} disabled={!picked} size={44}>
                  Potvrdit odpověď
                </PrimaryPill>
              )}
            </ActionBar>
          </>
        )}
      </div>
    </>
  );
}
