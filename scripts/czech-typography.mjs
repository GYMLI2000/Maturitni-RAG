// Czech typography: a non-breaking space after one-letter prepositions and conjunctions
// (k, s, v, z, o, u, a, i) inside string literals and JSX text only.
// Usage: node scripts/czech-typography.mjs [--check]
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import ts from "typescript";

const check = process.argv.includes("--check");
const roots = ["app", "components", "lib"];
// A one-letter word at the start or after whitespace/opening punctuation, followed by a space and a letter.
const pattern = /(^|[\s(„"'])([ksvzouaiKSVZOUAI]) (?=[\p{L}\d„(])/gu;

function files(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? files(p) : /\.(tsx?|mts)$/.test(f) ? [p] : [];
  });
}

export function fixText(text) {
  // Run twice so that chains like “a v Praze” are both fixed.
  return text.replace(pattern, "$1$2 ").replace(pattern, "$1$2 ");
}

let changed = 0;
for (const file of roots.flatMap(files)) {
  const src = readFileSync(file, "utf8");
  const sf = ts.createSourceFile(file, src, ts.ScriptTarget.Latest, true, file.endsWith("x") ? ts.ScriptKind.TSX : ts.ScriptKind.TS);
  const edits = [];
  const visit = (node) => {
    const isText =
      ts.isJsxText(node) ||
      ((ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isTemplateHead(node) || ts.isTemplateMiddle(node) || ts.isTemplateTail(node)) &&
        // Skip module specifiers and class names.
        !ts.isImportDeclaration(node.parent) &&
        !ts.isExportDeclaration(node.parent) &&
        !(ts.isJsxAttribute(node.parent) && node.parent.name.getText(sf) === "className"));
    if (isText) {
      const start = node.getStart(sf);
      const raw = src.slice(start, node.getEnd());
      const fixed = fixText(raw);
      if (fixed !== raw) edits.push({ start, end: node.getEnd(), fixed });
    }
    ts.forEachChild(node, visit);
  };
  visit(sf);
  if (!edits.length) continue;
  changed += edits.length;
  if (check) {
    for (const e of edits) console.log(`${file}: ${src.slice(e.start, e.end).trim().slice(0, 80)}`);
    continue;
  }
  let out = src;
  for (const e of edits.sort((a, b) => b.start - a.start)) out = out.slice(0, e.start) + e.fixed + out.slice(e.end);
  writeFileSync(file, out);
}

console.log(check ? `${changed} strings need a non-breaking space` : `Fixed ${changed} strings`);
if (check && changed) process.exit(1);
