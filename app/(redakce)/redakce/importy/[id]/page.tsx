import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { ImportReview } from "@/components/import-review";
import { RouteLoading } from "@/components/loading";
import { getImport } from "@/lib/api";
import { imports } from "@/lib/mock/catalog";

export function generateStaticParams() {
  return imports.map((i) => ({ id: i.id }));
}

export const metadata: Metadata = { title: "Kontrola importu" };

export default function ImportPage(props: PageProps<"/redakce/importy/[id]">) {
  return (
    <Suspense fallback={<RouteLoading />}>
      <ImportContent {...props} />
    </Suspense>
  );
}

async function ImportContent({ params }: PageProps<"/redakce/importy/[id]">) {
  const job = await getImport((await params).id);
  if (!job) notFound();
  return <ImportReview job={job} />;
}
