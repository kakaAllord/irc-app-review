/** Everyone invited to review. Each gets an ink colour used across the board. */
export const PEOPLE = [
  { name: "Pastor Sarah Ndosi", ink: "#7A3B8F" },
  { name: "Pastor Ndelimbi Ndosi", ink: "#1F5C4A" },
  { name: "Madam CK", ink: "#B23A16" },
  { name: "Brother Gideon", ink: "#2F4858" },
  { name: "Kaka Allord", ink: "#6B5B2E" },
] as const;

export type PersonName = (typeof PEOPLE)[number]["name"];

export const NAMES: readonly string[] = PEOPLE.map((p) => p.name);

export function isPerson(name: unknown): name is PersonName {
  return typeof name === "string" && NAMES.includes(name);
}

export function inkOf(name: string): string {
  return PEOPLE.find((p) => p.name === name)?.ink ?? "#2E2A21";
}

export function initialsOf(name: string): string {
  const words = name.split(/\s+/).filter(Boolean);
  const last = words[words.length - 1] ?? "";
  const first = words.length > 1 ? words[words.length - 2] : "";
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase() || "?";
}

export const MOODS = [
  { key: "Blessed", echo: "Amen to that." },
  { key: "Good", echo: "Good to hear." },
  { key: "Busy", echo: "Thanks for giving it a look." },
  { key: "Tiring", echo: "Take it slow. GOD has got you." },
] as const;
