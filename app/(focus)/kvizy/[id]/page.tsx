import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { RouteLoading } from "@/components/loading";
import { QuizView } from "@/components/quiz";
import { quizzes } from "@/lib/mock/study";

export function generateStaticParams() {
  return quizzes.map((q) => ({ id: q.id }));
}

export const metadata: Metadata = { title: "Kvíz" };

export default function QuizPage(props: PageProps<"/kvizy/[id]">) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <QuizContent {...props} />
    </Suspense>
  );
}

async function QuizContent({ params }: PageProps<"/kvizy/[id]">) {
  const { id } = await params;
  const quiz = quizzes.find((q) => q.id === id);
  if (!quiz) notFound();
  return <QuizView quiz={quiz} />;
}
