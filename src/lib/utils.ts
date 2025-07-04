import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
const COLORS: string[] = [
  "#F1416C",
  "#A838FF",
  "#FFC700",
  "#F9666E",
  "#d946ef",
  "#FFBB2C",
  "#35D29A",
  "#3699FF",
  "#7239EA",
  "#14b8a6",
  "#1d4ed8",
  "#be123c",
];

export function getRandomColorById(id: number): string {
  return COLORS[id % COLORS.length];
}
