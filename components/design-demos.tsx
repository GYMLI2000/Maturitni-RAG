"use client";

import { TutorUnavailable } from "@/components/study";

/** Frame 39 · “Studium · tutor nedostupný” as shown on the design system page. */
export function DemoTutorUnavailable() {
  return (
    <div className="flex min-h-[300px] flex-col [&>section]:flex-1">
      <TutorUnavailable caption="Studium · tutor nedostupný" onRetry={() => {}} />
    </div>
  );
}
