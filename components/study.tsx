"use client";

import {
  ArrowUp,
  BookOpen,
  CalendarClock,
  Check,
  ChevronLeft,
  Copy,
  Ellipsis,
  List,
  ListChecks,
  MessageSquareOff,
  Mic,
  Network,
  Plus,
  Quote,
  RotateCw,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Fragment, useEffect, useRef, useState, type FormEvent } from "react";
import { Breadcrumb } from "@/components/question";
import { CitationChip, CitationNumber } from "@/components/ui/bits";
import { GlassButton, GlassIconButton } from "@/components/ui/buttons";
import { Segmented } from "@/components/ui/segmented";
import { Sheet } from "@/components/ui/sheet";
import { askTutor, TutorUnavailableError } from "@/lib/api";
import { questionHref } from "@/lib/mock/questions";
import { cn } from "@/lib/cn";
import type { Question, Source, TutorMessage } from "@/lib/types";

type Msg = TutorMessage & { streaming?: boolean };

const suggestions: { label: string; icon: LucideIcon }[] = [
  { label: "Shrň to do tří bodů", icon: List },
  { label: "Co byla červencová krize?", icon: CalendarClock },
  { label: "Vyzkoušej mě", icon: ListChecks },
];

export function StudyView({ question, initialThread }: { question: Question; initialThread: TutorMessage[] }) {
  const sources = question.detail!.sources;
  const [messages, setMessages] = useState<Msg[]>(initialThread);
  const [openSource, setOpenSource] = useState<number | null>(1);
  const [sheetSource, setSheetSource] = useState<number | null>(null);
  const [unavailable, setUnavailable] = useState(false);
  const [draft, setDraft] = useState("");
  const busy = messages.some((m) => m.streaming);
  const abort = useRef<AbortController | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const lastQuestion = useRef("");

  // Deep link from the question page: …/studium#zdroj-2.
  useEffect(() => {
    const n = Number(window.location.hash.match(/^#zdroj-(\d+)$/)?.[1]);
    if (n) cite(n);
    return () => abort.current?.abort();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" });
  }, [messages.length, unavailable]);

  /** Opens a source: inspector on desktop, bottom sheet on mobile. */
  function cite(n: number) {
    if (window.matchMedia("(min-width: 1024px)").matches) setOpenSource(n);
    else setSheetSource(n);
  }

  async function send(text: string) {
    const t = text.trim();
    if (!t || busy) return;
    lastQuestion.current = t;
    setDraft("");
    setUnavailable(false);
    setMessages((m) => [...m, { role: "student", text: t }, { role: "tutor", text: "", streaming: true }]);
    abort.current = new AbortController();
    try {
      for await (const token of askTutor(question, t, abort.current.signal)) {
        setMessages((m) => m.map((msg, i) => (i === m.length - 1 ? { ...msg, text: msg.text + token } : msg)));
      }
      setMessages((m) =>
        m.map((msg, i) => (i === m.length - 1 ? { ...msg, streaming: false, citations: citedIn(msg.text) } : msg)),
      );
    } catch (e) {
      if (abort.current?.signal.aborted) return;
      // Drop the empty answer; keep the student's question.
      setMessages((m) => m.slice(0, -1));
      if (e instanceof TutorUnavailableError) setUnavailable(true);
      else throw e;
    }
  }

  function retry() {
    setMessages((m) => (m.at(-1)?.role === "student" ? m.slice(0, -1) : m));
    void send(lastQuestion.current);
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(draft);
  };

  return (
    <div className="flex gap-3 lg:h-dvh lg:py-2.5 lg:pr-2.5 lg:pl-3">
      <section aria-label="Konverzace s tutorem" className="relative flex min-w-0 flex-1 flex-col lg:surface lg:overflow-hidden lg:rounded-[22px]">
        {/* Floating bar */}
        <div className="sticky top-0 z-20 flex h-11 items-center gap-2 px-4 pt-3 lg:absolute lg:inset-x-4 lg:top-3.5 lg:h-10 lg:px-0 lg:pt-0">
          <span className="hidden lg:contents">
            <Breadcrumb back={questionHref(question)} items={[{ label: question.trail[0] }, { label: `Otázka ${question.id}` }]} />
          </span>
          <GlassIconButton href={questionHref(question)} icon={ChevronLeft} label="Zpět na otázku" size={44} className="lg:hidden" />
          <div className="flex-1" />
          <Segmented
            label="Režim otázky"
            value="studium"
            items={[
              { label: "Studovat", value: "studium", href: questionHref(question, "studium") },
              { label: "Mapa", value: "mapa", href: questionHref(question, "mapa") },
              { label: "Vyzkoušet se", value: "zkouska", href: questionHref(question, "zkouska") },
            ]}
          />
          <div className="flex-1" />
          <span className="hidden lg:contents">
            <GlassIconButton icon={Ellipsis} label="Další akce" aria-disabled />
          </span>
        </div>

        {/* Thread */}
        <div className="flex-1 lg:overflow-y-auto">
          <div className="mx-auto flex w-full max-w-[620px] flex-col gap-7 px-4 pt-6 pb-48 lg:px-0 lg:pt-[96px] lg:pb-40">
            <header className="flex flex-col gap-2">
              <p className="text-[13px] font-medium text-muted">{question.context}</p>
              <h1 className="text-[32px] leading-[1.1] font-semibold tracking-[-0.9px]">{question.title}</h1>
            </header>

            <div role="log" aria-live="polite" aria-relevant="additions" className="flex flex-col gap-7">
              {messages.map((m, i) =>
                m.role === "student" ? (
                  <div key={i} className="flex justify-end">
                    <p className="max-w-[85%] rounded-[20px] bg-hover px-4 py-3 text-[15px]">{m.text}</p>
                  </div>
                ) : (
                  <TutorAnswer key={i} msg={m} sources={sources} openSource={openSource} onCite={cite} mapHref={questionHref(question, "mapa")} />
                ),
              )}
            </div>

            {unavailable ? (
              <TutorUnavailable onRetry={retry} />
            ) : (
              !busy && (
                <div className="flex flex-col gap-2.5 pt-2">
                  <p className="text-[13px] font-medium text-muted">Pokračovat</p>
                  <div className="flex flex-wrap gap-2">
                    {suggestions.map((s) => (
                      <button
                        key={s.label}
                        type="button"
                        onClick={() => void send(s.label)}
                        className="press inline-flex h-9 items-center gap-2 rounded-full pr-3.5 pl-3 text-[13px] font-medium shadow-[inset_0_0_0_1px_var(--ring-strong)] hover:bg-hover"
                      >
                        <s.icon size={15} strokeWidth={1.5} className="text-muted" aria-hidden />
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
              )
            )}
            <div ref={endRef} />
          </div>
        </div>

        {/* Scroll edge + composer */}
        {!unavailable && (
          <>
            <div aria-hidden className="pointer-events-none fixed inset-x-0 bottom-0 z-10 h-[220px] bg-linear-to-b from-transparent to-(--bg-d) to-60% lg:absolute lg:h-[140px] lg:to-(--surface)" />
            <form
              onSubmit={onSubmit}
              className="glass fixed inset-x-4 bottom-[94px] z-20 mx-auto flex h-14 max-w-[620px] items-center gap-2 rounded-full px-2 [--g-blur:24px] [--g-b:30px] lg:absolute lg:bottom-7"
            >
              <GlassIconButton icon={Plus} label="Přidat přílohu" variant="plain" aria-disabled className="text-muted" />
              <label htmlFor="dotaz" className="sr-only">
                Dotaz pro tutora
              </label>
              <input
                id="dotaz"
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Zeptej se k této otázce…"
                autoComplete="off"
                className="h-full min-w-0 flex-1 bg-transparent text-[15px] text-fg outline-none placeholder:text-muted"
              />
              <GlassIconButton icon={Mic} label="Diktovat" variant="plain" aria-disabled className="text-muted" />
              <button
                type="submit"
                aria-label="Odeslat"
                disabled={busy || !draft.trim()}
                className="press ink flex size-10 shrink-0 items-center justify-center rounded-full disabled:opacity-100"
              >
                <ArrowUp size={18} strokeWidth={2} aria-hidden />
              </button>
            </form>
          </>
        )}
      </section>

      {/* Inspector (desktop) */}
      <AnimatePresence initial={false}>
        {openSource !== null && (
          <SourceInspector key="inspector" source={sources.find((s) => s.n === openSource)!} onClose={() => setOpenSource(null)} mapHref={questionHref(question, "mapa")} />
        )}
      </AnimatePresence>

      {/* Bottom sheet (mobile) */}
      <Sheet open={sheetSource !== null} onClose={() => setSheetSource(null)} label="Zdroj">
        {sheetSource !== null && (
          <SourceBody source={sources.find((s) => s.n === sheetSource)!} onClose={() => setSheetSource(null)} mapHref={questionHref(question, "mapa")} />
        )}
      </Sheet>
    </div>
  );
}

function citedIn(text: string) {
  return [...new Set([...text.matchAll(/\[(\d+)\]/g)].map((m) => Number(m[1])))];
}

/** Renders text with inline [n] markers as small citation buttons. */
function CitedText({ text, onCite }: { text: string; onCite: (n: number) => void }) {
  const parts = text.split(/(\[\d+\])/g);
  return (
    <>
      {parts.map((p, i) => {
        const n = p.match(/^\[(\d+)\]$/)?.[1];
        if (!n) return <Fragment key={i}>{p}</Fragment>;
        return (
          <button key={i} type="button" onClick={() => onCite(Number(n))} aria-label={`Zdroj ${n}`} className="hit mx-0.5 inline-flex -translate-y-px align-middle">
            <CitationNumber n={Number(n)} size={16} />
          </button>
        );
      })}
    </>
  );
}

function TutorAnswer({
  msg,
  sources,
  openSource,
  onCite,
  mapHref,
}: {
  msg: Msg;
  sources: Source[];
  openSource: number | null;
  onCite: (n: number) => void;
  mapHref: string;
}) {
  const [copied, setCopied] = useState(false);
  const [vote, setVote] = useState<"up" | "down" | null>(null);
  const paragraphs = msg.text.split("\n\n");

  return (
    <article aria-label="Odpověď tutora" aria-busy={msg.streaming} className="flex flex-col gap-3.5">
      <div className="flex items-center gap-2">
        <span aria-hidden className="mesh-hero flex size-[22px] items-center justify-center rounded-full text-white">
          <Sparkles size={12} strokeWidth={2} />
        </span>
        <span className="text-[13px] font-semibold">Tutor</span>
        <span className="text-[13px] text-muted">z ověřených podkladů</span>
      </div>
      {msg.text === "" && msg.streaming ? (
        <p className="text-[16px] text-muted">
          <span className="animate-pulse">Hledám v podkladech…</span>
        </p>
      ) : (
        paragraphs.map((p, i) => (
          <p key={i} className="text-[16px] leading-[1.6] whitespace-pre-line">
            <CitedText text={p} onCite={onCite} />
          </p>
        ))
      )}
      {!msg.streaming && !!msg.citations?.length && (
        <>
          <div className="flex flex-wrap gap-2">
            {msg.citations.map((n) => {
              const s = sources.find((x) => x.n === n);
              return s && <CitationChip key={n} n={n} label={s.chip} active={openSource === n} onClick={() => onCite(n)} />;
            })}
          </div>
          <div className="flex gap-1 text-muted">
            <SmallAction
              label={copied ? "Zkopírováno" : "Kopírovat"}
              icon={copied ? Check : Copy}
              onClick={() => {
                void navigator.clipboard?.writeText(msg.text.replace(/\s?\[\d+\]/g, ""));
                setCopied(true);
                setTimeout(() => setCopied(false), 1500);
              }}
            />
            <SmallAction label="Dobrá odpověď" icon={ThumbsUp} pressed={vote === "up"} onClick={() => setVote((v) => (v === "up" ? null : "up"))} />
            <SmallAction label="Špatná odpověď" icon={ThumbsDown} pressed={vote === "down"} onClick={() => setVote((v) => (v === "down" ? null : "down"))} />
            <Link href={mapHref} aria-label="Zobrazit v mapě pojmů" title="Zobrazit v mapě pojmů" className="hit flex size-8 items-center justify-center rounded-full hover:bg-hover hover:text-fg">
              <Network size={16} strokeWidth={1.5} aria-hidden />
            </Link>
          </div>
        </>
      )}
    </article>
  );
}

function SmallAction({ label, icon: Icon, onClick, pressed }: { label: string; icon: LucideIcon; onClick: () => void; pressed?: boolean }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      className={cn("hit press flex size-8 items-center justify-center rounded-full hover:bg-hover hover:text-fg", pressed && "text-accent")}
    >
      <Icon size={16} strokeWidth={1.5} fill={pressed ? "currentColor" : "none"} fillOpacity={pressed ? 0.15 : 0} aria-hidden />
    </button>
  );
}

/** Frame 39 · “Studium · tutor nedostupný”. */
export function TutorUnavailable({ onRetry, caption }: { onRetry: () => void; caption?: string }) {
  return (
    <section role="alert" className="mesh-hero flex flex-col overflow-hidden rounded-[26px] p-7 text-white">
      {caption && (
        <>
          <p className="text-[12px] font-semibold text-white/70">{caption}</p>
          <div className="min-h-4 flex-1" />
        </>
      )}
      <h2 className="text-[22px] font-semibold tracking-[-0.5px]">Chat je dočasně nedostupný</h2>
      <p className="mt-1.5 max-w-[440px] text-[15px] leading-[1.5] text-white/80">Studijní podklady můžeš dál otevřít. Zkusíme to znovu automaticky.</p>
      <div className="glass-thin glass-on-hero mt-[18px] flex h-14 items-center gap-2.5 rounded-full pr-2 pl-[18px] [--g-blur:24px] [--g-y:8px] [--g-b:24px]">
        <MessageSquareOff size={18} strokeWidth={1.5} className="text-white/80" aria-hidden />
        <span className="flex-1 text-[15px] text-white/80">Tutor teď neodpovídá</span>
        <button type="button" onClick={onRetry} className="press flex h-10 items-center gap-1.5 rounded-full bg-white px-4 text-[14px] font-semibold text-[#14182B]">
          <RotateCw size={15} strokeWidth={2} aria-hidden />
          Zkusit znovu
        </button>
      </div>
    </section>
  );
}

function SourceInspector({ source, onClose, mapHref }: { source: Source; onClose: () => void; mapHref: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.aside
      aria-label="Zdroj"
      initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
      exit={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(8px)" }}
      transition={{ type: "spring", bounce: 0, duration: 0.35 }}
      className="glass-thick hidden w-[344px] shrink-0 flex-col rounded-[22px] pt-3.5 pr-3.5 pb-5 pl-5 lg:flex"
    >
      <SourceBody source={source} onClose={onClose} mapHref={mapHref} />
    </motion.aside>
  );
}

function SourceBody({ source, onClose, mapHref }: { source: Source; onClose: () => void; mapHref: string }) {
  const passage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    passage.current?.scrollIntoView({ block: "nearest" });
  }, [source.n]);

  return (
    <div className="flex min-h-0 flex-1 flex-col px-5 pb-5 lg:p-0">
      <div className="flex h-10 shrink-0 items-center">
        <span className="flex h-6 items-center gap-1.5 rounded-full bg-soft pr-2.5 pl-1 text-[12px] font-semibold text-accent">
          <CitationNumber n={source.n} size={16} />
          Zdroj
        </span>
        <div className="flex-1" />
        <GlassIconButton icon={X} label="Zavřít zdroj" size={32} iconSize={16} variant="plain" onClick={onClose} />
      </div>
      <div key={source.n} className="flex min-h-0 flex-1 flex-col gap-1.5 overflow-y-auto pt-[18px] pr-1.5">
        <h2 className="text-[22px] font-semibold tracking-[-0.5px]">{source.title}</h2>
        <p className="text-[13px] text-muted">{source.meta}</p>
        <p className="mt-[18px] text-[14px] leading-[1.6] text-muted">{source.before}</p>
        <div ref={passage} className="raised mt-3 flex flex-col gap-2 rounded-[14px] px-4 py-3.5">
          <p className="flex items-center gap-1.5 text-[12px] font-semibold text-accent">
            <Quote size={14} strokeWidth={2} aria-hidden />
            Použito v odpovědi
          </p>
          <p className="text-[15px] leading-[1.6]">
            <mark className="bg-transparent text-fg">{source.passage}</mark>
          </p>
        </div>
        <p className="mt-3 text-[14px] leading-[1.6] text-muted">{source.after}</p>
      </div>
      <div className="flex shrink-0 gap-2 pt-4 pr-1.5">
        <GlassButton icon={BookOpen} variant="solid" full className="flex-1" aria-disabled title="Celý podklad připravujeme">
          Celý podklad
        </GlassButton>
        <GlassButton href={mapHref} icon={Network} variant="solid" full className="flex-1">
          Mapa pojmů
        </GlassButton>
      </div>
    </div>
  );
}
