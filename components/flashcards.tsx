"use client";

import { ChevronLeft, Landmark, Layers2, Lightbulb, RotateCcw, Shuffle, SkipForward } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { DoneCard } from "@/components/done-card";
import { ActionBar, capsule, FocusBar } from "@/components/focus";
import { Chip, CitationChip, Kbd, ProgressTrack } from "@/components/ui/bits";
import { GlassButton, GlassIconButton, PrimaryPill } from "@/components/ui/buttons";
import { plural } from "@/lib/plural";
import { cn } from "@/lib/cn";
import type { Flashcard, Rating } from "@/lib/types";

const dots = { error: "bg-error", warning: "bg-warning", success: "bg-success" } as const;

/** Frames 32 (front), 24 (answer) and 33 (done). Space flips, 1–3 rates. */
export function Flashcards({ title, cards, ratings }: { title: string; cards: Flashcard[]; ratings: Rating[] }) {
  const reduce = useReducedMotion();
  const [order, setOrder] = useState(() => cards.map((_, i) => i));
  const [pos, setPos] = useState(0);
  const [revealed, setRevealed] = useState(false);
  // Animate the reveal only when it came from a pointer; keyboard actions stay instant.
  const [animate, setAnimate] = useState(false);
  const [rated, setRated] = useState<Rating["key"][]>([]);
  const done = pos >= order.length;
  const card = cards[order[Math.min(pos, order.length - 1)]];

  const flip = useCallback((fromPointer: boolean) => {
    setAnimate(fromPointer);
    setRevealed(true);
  }, []);

  const advance = useCallback(() => {
    setRevealed(false);
    setAnimate(false);
    setPos((p) => p + 1);
  }, []);

  const rate = useCallback(
    (key: Rating["key"]) => {
      setRated((r) => [...r, key]);
      advance();
    },
    [advance],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (done || e.metaKey || e.ctrlKey || e.altKey || (e.target as HTMLElement).closest("input,textarea,select")) return;
      if (e.key === " " && !revealed) {
        if ((e.target as HTMLElement).closest("button,a")) return;
        e.preventDefault();
        flip(false);
      } else if (revealed && ["1", "2", "3"].includes(e.key)) {
        e.preventDefault();
        rate(Number(e.key) as Rating["key"]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [done, revealed, flip, rate]);

  const restart = () => {
    setOrder(cards.map((_, i) => i));
    setPos(0);
    setRated([]);
    setRevealed(false);
  };

  const known = rated.filter((r) => r === 3).length;

  return (
    <>
      <FocusBar
        left={<GlassIconButton href="/" icon={ChevronLeft} label="Zpět" size={44} />}
        center={
          !done && (
            <div className={cn(capsule, "gap-3.5 px-[18px]")}>
              <Layers2 size={16} strokeWidth={1.5} className="hidden text-muted sm:block" aria-hidden />
              <span className="hidden font-semibold sm:inline">{title}</span>
              <ProgressTrack value={(pos + 1) / order.length} className="h-1.5 w-24" label="Postup balíčkem" />
              <span className="tnum font-medium text-muted">
                {pos + 1} z {order.length}
              </span>
            </div>
          )
        }
        right={
          !done && (
            <GlassIconButton
              icon={Shuffle}
              label="Zamíchat zbývající"
              size={44}
              onClick={() =>
                setOrder((o) => [...o.slice(0, pos + 1), ...o.slice(pos + 1).sort(() => Math.random() - 0.5)])
              }
            />
          )
        }
      />

      <div className="flex w-full flex-1 flex-col items-center justify-center gap-6 py-6">
        {done ? (
          <DoneCard
            title="Na dnešek máš hotovo"
            text="Další kartičky se ti připraví zítra ráno."
            stats={[
              { value: rated.length, label: plural(rated.length, "kartička", "kartičky", "kartiček").replace(/^\d+ /, "") },
              { value: known, label: "umím", tone: "success" },
              { value: rated.length - known, label: "zopakovat", tone: "warning" },
            ]}
            actions={
              <>
                <PrimaryPill href="/balicky" arrow size={44}>
                  Procházet předměty
                </PrimaryPill>
                <GlassButton icon={RotateCcw} variant="solid" size={44} onClick={restart}>
                  Projít znovu
                </GlassButton>
              </>
            }
          />
        ) : (
          <>
            {/* The card stays put; only its content cross-fades. */}
            <article aria-live="polite" className="surface relative grid min-h-[420px] w-full max-w-[640px] rounded-[32px]">
              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={`${pos}-${revealed}`}
                  initial={animate && !reduce ? { opacity: 0, filter: "blur(2px)" } : false}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={animate && !reduce ? { opacity: 0, filter: "blur(2px)" } : { opacity: 0, transition: { duration: 0 } }}
                  transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
                  className="col-start-1 row-start-1 flex flex-col px-6 pt-8 pb-7 lg:px-10 lg:pt-9 lg:pb-8"
                >
                  {revealed ? <Back card={card} /> : <Front card={card} />}
                </motion.div>
              </AnimatePresence>
            </article>

            {revealed ? (
              <div role="group" aria-label="Jak ti to šlo?" className="glass sticky bottom-6 z-20 flex h-[76px] w-full max-w-[640px] gap-1 rounded-full p-1.5">
                {ratings.map((r) => (
                  <button
                    key={r.key}
                    type="button"
                    onClick={() => rate(r.key)}
                    aria-keyshortcuts={String(r.key)}
                    className="press flex h-16 flex-1 items-center gap-3 rounded-full px-3 text-left hover:bg-panel hover:shadow-[0_2px_8px_var(--glass-shadow)] focus-visible:bg-panel sm:px-[18px]"
                  >
                    <span className="hidden sm:contents">
                      <Kbd className="size-[26px] rounded-lg text-[12px]">{r.key}</Kbd>
                    </span>
                    <span className="flex flex-col gap-0.5">
                      <span className="flex items-center gap-1.5 text-[14px] font-semibold">
                        <span aria-hidden className={cn("size-[7px] rounded-full", dots[r.tone])} />
                        {r.label}
                      </span>
                      <span className="text-[12px] text-muted">{r.interval}</span>
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <ActionBar label="Kartička" className="lg:pl-3.5">
                <button type="button" onClick={advance} className="press flex h-11 items-center gap-1.5 rounded-full px-3.5 text-[14px] font-medium text-muted hover:text-fg">
                  <SkipForward size={15} strokeWidth={1.5} aria-hidden />
                  Přeskočit
                </button>
                <div className="flex-1" />
                <span className="hidden sm:contents">
                  <Kbd className="px-2">mezerník</Kbd>
                </span>
                <PrimaryPill onClick={() => flip(true)} size={44} aria-keyshortcuts="Space">
                  Otočit kartičku
                </PrimaryPill>
              </ActionBar>
            )}
          </>
        )}
      </div>
    </>
  );
}

function Front({ card }: { card: Flashcard }) {
  return (
    <div className="flex flex-1 flex-col justify-between gap-8">
      <div className="flex items-center">
        <p className="flex-1 text-[12px] font-semibold text-accent">Otázka</p>
        <Chip icon={Landmark}>Dějepis</Chip>
      </div>
      <h1 className="text-[28px] leading-[1.15] font-semibold tracking-[-0.8px] lg:text-[36px] lg:tracking-[-1px]">{card.question}</h1>
      <p className="flex items-center gap-2 text-[13px] text-muted">
        <Lightbulb size={15} strokeWidth={1.5} aria-hidden />
        {card.hint}
      </p>
    </div>
  );
}

function Back({ card }: { card: Flashcard }) {
  return (
    <>
      <div className="flex flex-col gap-2">
        <p className="text-[12px] font-semibold text-muted">Otázka</p>
        <p className="text-[17px] font-medium text-muted">{card.question}</p>
      </div>
      <hr className="mt-6 mb-7 border-border" />
      <p className="text-[12px] font-semibold text-accent">Odpověď</p>
      <h1 className="mt-2.5 text-[24px] leading-[1.25] font-semibold tracking-[-0.7px] lg:text-[28px]">{card.answer}</h1>
      <p className="mt-5 text-[16px] leading-[1.55] text-muted">{card.detail}</p>
      <CitationChip n={1} label={card.citation} href="/predmety/dejepis/otazky/7/studium#zdroj-1" className="mt-7" />
    </>
  );
}
