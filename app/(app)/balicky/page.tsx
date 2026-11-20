import type { Metadata } from "next";
import { Catalog } from "@/components/catalog";

export const metadata: Metadata = { title: "Studijní balíčky" };

export default function CatalogPage() {
  return <Catalog />;
}
