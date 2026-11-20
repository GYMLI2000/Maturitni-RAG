import type { Metadata } from "next";
import { Flashcards } from "@/components/flashcards";
import { flashcardDeck, ratings } from "@/lib/mock/study";

export const metadata: Metadata = { title: "Kartičky" };

export default function FlashcardsPage() {
  return <Flashcards title={flashcardDeck.title} cards={flashcardDeck.cards} ratings={ratings} />;
}
