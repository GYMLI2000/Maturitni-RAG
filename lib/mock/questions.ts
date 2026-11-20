import type { Question, Source } from "@/lib/types";

export const ww1Sources: Source[] = [
  {
    n: 1,
    title: "Studijní podklad",
    chip: "Studijní podklad, kap. 4",
    meta: "Kapitola 4 · Příčiny konfliktu · s. 42",
    listMeta: "Kapitola 4 · s. 42",
    icon: "book-open",
    before:
      "Napětí v Evropě narůstalo už před rokem 1914. Velmoci soupeřily o kolonie a trhy a uzavíraly spojenectví, která měla zaručit bezpečnost.",
    passage:
      "Soupeření velmocí o vliv a jejich spojenecké závazky patřily k dlouhodobým příčinám války. Atentát v Sarajevu se stal bezprostřední záminkou.",
    after:
      "Rakousko-Uhersko vydalo Srbsku ultimátum a po jeho odmítnutí vyhlásilo válku. Spojenecké závazky pak během několika dní zatáhly do konfliktu další mocnosti.",
  },
  {
    n: 2,
    title: "Časová osa 1900–1914",
    chip: "Časová osa 1900–1914",
    meta: "Přehled událostí",
    listMeta: "Přehled událostí",
    icon: "calendar-range",
    before: "Přehled událostí, které vedly k první světové válce.",
    passage: "28. června 1914 zastřelil Gavrilo Princip následníka trůnu Františka Ferdinanda d’Este. Atentát spustil červencovou krizi.",
    after: "Během července 1914 se krize rozšířila na spojenecké bloky.",
  },
];

export const questions: Question[] = [
  {
    subject: "dejepis",
    id: "7",
    title: "Příčiny první světové války",
    trail: ["Dějepis", "Moderní dějiny"],
    context: "Moderní dějiny · ústní okruh 7",
    exam: {
      type: "text",
      title: "Příčiny první světové války",
      label: "Dějepis · ústní okruh 7",
      prompt: "Vysvětli dlouhodobé příčiny první světové války a odliš je od bezprostřední záminky.",
    },
    detail: {
      tags: ["Ústní okruh", "Publikovaný balíček · verze 2"],
      prompt: "Vysvětli dlouhodobé příčiny první světové války a odliš je od bezprostřední záminky.",
      duration: "Asi 10 minut ústně",
      outline: [
        { title: "Evropa před rokem 1914", question: "Jaké velmoci soupeřily a o co?", state: "done" },
        { title: "Spojenectví a zbrojení", question: "Proč vznikly dva bloky a co znamenaly?", state: "current" },
        { title: "Nacionalismus na Balkáně", question: "Jaké napětí panovalo v regionu?", state: "todo" },
        { title: "Sarajevo a červencová krize", question: "Jak se z atentátu stala válka?", state: "todo" },
      ],
      sources: ww1Sources,
      lastAttempt: {
        when: "Včera",
        status: "Potřeba opakovat",
        note: "Chybělo rozlišení mezi příčinou a záminkou.",
        attempt: "1",
      },
    },
  },
  {
    subject: "matematika",
    id: "4",
    title: "Kvadratická funkce",
    trail: ["Matematika", "Funkce"],
    context: "Funkce · otázka 4",
    exam: {
      type: "number",
      label: "Matematika · úloha 4",
      title: "Objem hranolu",
      prompt: "Podstava kolmého hranolu má obsah 24 cm². Výška hranolu je 8 cm. Urči jeho objem.",
      units: ["cm³", "cm²", "dm³"],
      key: { value: 192, unit: "cm³" },
    },
  },
  { subject: "matematika", id: "2", title: "Kvadratické rovnice", trail: ["Matematika", "Funkce a rovnice"], context: "Funkce a rovnice · otázka 2", exam: { type: "text", title: "Kvadratické rovnice", label: "Matematika · otázka 2", prompt: "" } },
  { subject: "matematika", id: "1", title: "Lineární funkce", trail: ["Matematika", "Funkce"], context: "Funkce · otázka 1", exam: { type: "text", title: "Lineární funkce", label: "Matematika · otázka 1", prompt: "" } },
  { subject: "dejepis", id: "3", title: "Revoluce roku 1848", trail: ["Dějepis", "Moderní dějiny"], context: "Moderní dějiny · ústní okruh 3", exam: { type: "text", title: "Revoluce roku 1848", label: "Dějepis · ústní okruh 3", prompt: "" } },
  { subject: "anglictina", id: "1", title: "The United Kingdom", trail: ["Angličtina", "Reálie"], context: "Reálie · okruh 1", exam: { type: "text", title: "The United Kingdom", label: "Angličtina · okruh 1", prompt: "" } },
];

export function questionHref(q: Pick<Question, "subject" | "id">, view = "") {
  return `/predmety/${q.subject}/otazky/${q.id}${view ? `/${view}` : ""}`;
}

/** Questions that can be tried in the exam view: they have a prompt to answer. */
export const examQuestions = questions.filter((q) => q.exam.prompt);
