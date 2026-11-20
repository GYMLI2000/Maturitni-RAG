import type { Metadata } from "next";
import { QuizSetup } from "@/components/quiz-setup";

export const metadata: Metadata = { title: "Nový kvíz" };

export default function NewQuizPage() {
  return <QuizSetup />;
}
