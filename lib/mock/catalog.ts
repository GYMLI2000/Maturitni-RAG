import type { ImportJob, Package, UpcomingPackage } from "@/lib/types";

export const packages: Package[] = [
  {
    id: "maturita-zaklad",
    title: "Maturita · všeobecný základ",
    description: "Společné předměty pro přípravu k maturitě.",
    access: "open",
    questions: 148,
    subjects: ["Dějepis", "Matematika", "Angličtina", "Čeština"],
    category: "maturita",
    status: "Redakčně ověřeno · verze 2",
    added: true,
  },
  {
    id: "ekonomika",
    title: "Ekonomika a podnikání",
    description: "Odborná část pro obchodní akademie.",
    access: "school",
    questions: 62,
    subjects: ["Ekonomika", "Účetnictví"],
    category: "odborne",
    status: "Redakčně ověřeno · verze 2",
    added: false,
    cover: ["#0B3F3A", "#13786A", "#2FA58C", "#6BD3B8"],
  },
];

export const upcomingPackages: UpcomingPackage[] = [
  { title: "Fyzika · seminář", kind: "Profilová zkouška", icon: "atom" },
  { title: "Biologie", kind: "Profilová zkouška", icon: "dna" },
  { title: "Angličtina B2", kind: "Rozšířená úroveň", icon: "languages" },
];

export const imports: ImportJob[] = [
  {
    id: "24",
    file: "otazky_maturita.csv",
    pkg: "Maturita · všeobecný základ",
    newCount: 18,
    updatedCount: 4,
    rows: [
      { title: "Příčiny první světové války", subject: "Dějepis", change: "update", version: "v2 → v3" },
      { title: "Kvadratická rovnice", subject: "Matematika", change: "new", error: "Chybí ověřený zdroj", version: "v1" },
      { title: "The United Kingdom", subject: "Angličtina", change: "new", version: "v1" },
      { title: "Evropa po roce 1918", subject: "Dějepis", change: "update", error: "Odkaz na neexistující podklad", version: "v1 → v2" },
      { title: "Lineární funkce", subject: "Matematika", change: "new", version: "v1" },
      { title: "Education and work", subject: "Angličtina", change: "new", version: "v1" },
      { title: "Vznik Československa", subject: "Dějepis", change: "new", version: "v1" },
    ],
  },
];
