import { notFound } from "next/navigation";
import { getQuestion } from "@/lib/api";
import { questions } from "@/lib/mock/questions";
import { getSubject } from "@/lib/mock/subjects";

export function questionParams() {
  return questions.map((q) => ({ predmet: q.subject, id: q.id }));
}

export async function loadQuestion(params: Promise<{ predmet: string; id: string }>) {
  const { predmet, id } = await params;
  const question = await getQuestion(predmet, id);
  const subject = getSubject(predmet);
  if (!question || !subject) notFound();
  return { question, subject };
}
