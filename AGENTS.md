# Pokyny pro agenty

## Projekt a zdroje pravdy

Studium je český frontend pro přípravu k maturitě. Používá Next.js App Router,
TypeScript strict, React, Tailwind CSS v4, Geist, lucide-react, motion a next-themes.
Aktuální verze závislostí a příkazy jsou v `package.json`.

- `README.md`: spuštění, routy a rozsah aplikace.
- `DESIGN.md`: pravidla vzhledu a interakcí.
- `design/MaturitaRAG.pen`: vizuální předloha, framy 20–39 „· Glass“ a tmavé kopie.
- `DECISIONS.md`: rozhodnutí a odchylky od předlohy.
- `PRD - maturita`: produktový záměr; popisuje i dosud neimplementované části.

## Sdílená paměť

<!-- shared-agent-memory:start -->
Pro relevantní programátorské úkoly přečti a dodržuj
`/Users/jonas/Documents/Second Brain/System/Agent Workflow.md`.
Sdílený vault: `/Users/jonas/Documents/Second Brain`.
Pokud kontext nedodaly hooky, spusť z kořene tohoto repozitáře:
`/Users/jonas/.local/bin/agent-memory preflight --query "klíčová slova úkolu"`.
Po přepnutí repozitáře preflight zopakuj. Dodržuj ERROR CAPTURE a VERIFY lifecycle
a oprávnění souborového systému. Pokud paměť nejde číst, uveď omezení; nevymýšlej její obsah.
<!-- shared-agent-memory:end -->

## Kde měnit kód

- `app/(app)`: studentské stránky se sidebarem.
- `app/(focus)`: soustředěné toky zkoušky, kvízu a kartiček.
- `app/(redakce)`: redakční rozhraní.
- `components/`: obrazovky; `components/ui/`: sdílené ovládací prvky;
  `components/shell/`: navigace a rám aplikace.
- `lib/types.ts`: sdílené datové typy; `lib/api.ts`: současné mock API;
  `lib/mock/`: ukázková data. `lib/load.ts` řeší načítání pro stránky.
- `app/globals.css`: materiály, utility a přístupnost.
  `app/tokens.css` se generuje z `.pen` přes `node scripts/gen-tokens.mjs`; neupravuj jej ručně.
- `e2e/flows.spec.ts`: integrační průchody v Playwrightu.

## Pravidla změn

1. Přečti dotčený kód a jeho volající. Udělej nejmenší úplnou změnu podle okolních vzorů.
2. Použij existující komponenty, tokeny a závislosti. Nepřidávej abstrakce ani balíčky pro budoucí potřeby.
3. Zachovej české texty, klávesové ovládání, focus, oba režimy vzhledu a mobilní rozložení.
4. Mock tutor, hodnocení a import nejsou produkční backend. Neoznačuj lokální stav za trvale uložená data.
   Při napojování backendu zachovej smlouvy API nebo uprav všechny volající;
   klíče odpovědí a oprávnění musí kontrolovat server.
5. Neodstraňuj validaci, chybové stavy ani citace podkladů. Novou netriviální logiku ověř malým smysluplným testem.
6. Nezasahuj do cizích rozpracovaných změn. Aktualizuj dokumentaci, pokud se mění popsané chování.

## Ověření

Pro změny kódu spusť `npx tsc --noEmit`, `npm run lint` a `npm run build`.
Pro změny uživatelských toků spusť `npx playwright test`;
bez `BASE_URL` si testy sestaví a spustí produkční aplikaci.
Při změně českých textů použij `node scripts/czech-typography.mjs --check`.
Vizuální změny ověř na desktopu i mobilu, ve světlém a tmavém režimu;
postup pro snímky je v `README.md`.
U čisté dokumentace stačí zkontrolovat odkazy, cesty, příkazy a diff.
V závěru uveď provedené kontroly a případná omezení.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
