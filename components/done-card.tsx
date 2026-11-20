import { Check } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Finished session (frame 33): badge, headline, three stats, next actions. */
export function DoneCard({
  title,
  text,
  stats,
  actions,
}: {
  title: string;
  text: string;
  stats: { value: number; label: string; tone?: "success" | "warning" }[];
  actions: ReactNode;
}) {
  return (
    <section aria-labelledby="hotovo" className="surface flex w-full max-w-[560px] flex-col items-center rounded-[32px] px-6 pt-11 pb-9 text-center lg:px-10">
      <span className="flex size-[72px] items-center justify-center rounded-full bg-success-soft text-success">
        <Check size={32} strokeWidth={2} aria-hidden />
      </span>
      <h1 id="hotovo" className="mt-5 text-[30px] font-semibold tracking-[-0.8px]">
        {title}
      </h1>
      <p className="mt-2 text-[16px] text-muted">{text}</p>
      <dl className="mt-7 grid w-full grid-cols-3 gap-2.5 text-left">
        {stats.map((s) => (
          <div key={s.label} className="flex flex-col-reverse gap-0.5 rounded-[18px] bg-hover p-4">
            <dt className="text-[13px] text-muted">{s.label}</dt>
            <dd className={cn("tnum text-[26px] font-semibold tracking-[-0.6px]", s.tone === "success" && "text-success", s.tone === "warning" && "text-warning")}>
              {s.value}
            </dd>
          </div>
        ))}
      </dl>
      <div className="mt-7 flex flex-wrap justify-center gap-2.5">{actions}</div>
    </section>
  );
}
