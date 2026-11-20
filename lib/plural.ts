/** Czech plural: 1 položka, 2–4 položky, 0 and 5+ položek. */
export function plural(n: number, one: string, few: string, many: string) {
  return `${n} ${n === 1 ? one : n >= 2 && n <= 4 ? few : many}`;
}
