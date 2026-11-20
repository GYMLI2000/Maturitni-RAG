import { Suspense } from "react";
import { RouteLoading } from "@/components/loading";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ExamView } from "@/components/exam";
import { loadQuestion } from "@/lib/load";
import { examQuestions } from "@/lib/mock/questions";

export function generateStaticParams() {
  return examQuestions.map((q) => ({ predmet: q.subject, id: q.id }));
}

export async function generateMetadata({ params }: PageProps<"/predmety/[predmet]/otazky/[id]/zkouska">): Promise<Metadata> {
  const { question } = await loadQuestion(params);
  return { title: `Zkouška nanečisto · ${question.title}` };
}

export default function ExamPage(props: PageProps<"/predmety/[predmet]/otazky/[id]/zkouska">) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <ExamPageContent {...props} />
    </Suspense>
  );
}

async function ExamPageContent({ params }: PageProps<"/predmety/[predmet]/otazky/[id]/zkouska">) {
  const { question } = await loadQuestion(params);
  if (!question.exam.prompt) notFound();
  return <ExamView question={question} />;
}
