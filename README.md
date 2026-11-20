# Maturitni-RAG



# Maturitní studijní aplikace

Jedna aplikace pro přípravu k maturitě napříč předměty. Student pracuje s naší vlastní bankou otázek a materiálů. Může se vyzkoušet nanečisto, zeptat se tutora, projít myšlenkovou mapu a procvičit slabší místa pomocí kvízů a kartiček.

## Rozdělení vývoje

| Role | Vlastník | Odpovědnost |
| --- | --- | --- |
| Frontend pro studenty | Doplnit | Studentské obrazovky, navigace a napojení na API. |
| Administrace a import | Doplnit | Redakční rozhraní, administrační API, import a publikování obsahu. |
| Jádro backendu | Doplnit | Databáze, účty a oprávnění, studentské API, hodnocení a pokrok. |
| AI a práce s podklady | Doplnit | Zpracování podkladů, RAG, tutor, návrhy studijních výstupů a NotebookLM MCP. |

### 1. Frontend pro studenty

- Vytvoří výběr předmětu, detail otázky, zkoušku nanečisto, výsledek a přehled pokroku.
- Zobrazí chat s odkazy na zdroje, myšlenkovou mapu, kvíz a kartičky. Pohlídá průchod mezi nimi na telefonu i desktopu.
- **První výstup** Student vybere otázku, odpoví a zobrazí výsledek. První verze obrazovky může používat ukázková data podle dohodnutého API.

### 2. Administrace a import

- Postaví editor předmětů, témat, otázek, řešení a příloh včetně příslušného API.
- Připraví hromadný import s náhledem, chybami u jednotlivých položek, koncepty a publikováním.
- Přidá redakční kontrolu a publikování návrhů map a kartiček.
- **První výstup** Autor naimportuje otázky ze dvou předmětů, opraví chybu a publikuje balíček dostupný studentům.

### 3. Jádro backendu

- Spravuje databázový model, přihlášení, oprávnění a studentské API. S administrací domluví, jak aplikace čte publikované verze obsahu.
- Implementuje ukládání pokusů, bodování podle klíče, historii výsledků a termíny opakování kartiček.
- Připraví sdílené testovací nasazení aplikace.
- **První výstup** Backend uloží pokus a vyhodnotí otázku podle klíče. Před odevzdáním poskytne jen zadání a přílohy určené k řešení.

### 4. AI a práce s podklady

- Zpracuje schválené podklady pro vlastní RAG a zachová odkazy na stránky nebo konkrétní pasáže.
- Přes OpenAI Agents SDK zapojí tutora s citacemi a generování návrhů map, kartiček a zpětné vazby podle hodnoticích kritérií.
- Ověří oficiální NotebookLM MCP na vytvoření sešitu, vložení podporovaného zdroje a stavu zpracování.
- **První výstup** Tutor zodpoví dotaz k publikované otázce a odkáže na konkrétní místo ve schváleném podkladu.

## Jak na sebe práce navazuje

1. **Dohoda o rozhraní.** Frontend, administrace a backend si odsouhlasí podobu otázky, příloh, odevzdané odpovědi a výsledku. AI část s nimi sjednotí formát citací a dat pro mapu a kartičky.
2. **První společné demo.** Administrace publikuje jednu matematickou a jednu ústní otázku. Studentské rozhraní je zobrazí, backend uloží oba pokusy a výpočet vyhodnotí podle klíče. U ústní otázky student po pokusu uvidí kritéria. Tutor ve studijním režimu odkáže na schválený podklad.
3. **Rozšíření po demu.** Propojí se mapa, kvízy a kartičky se skutečnými tématy a pokrokem studenta. Redakce může studijní výstupy zkontrolovat a zveřejnit.

**První milník je splněný**, když autor přidá novou otázku v administraci a student ji ve stejné aplikaci vyřeší, dostane zpětnou vazbu a vidí další krok k procvičení.
