import type { RetrospectiveSnapshot } from "./types";

const POOL_KEY = "retrospective.pool.v1";
const HISTORY_KEY = "retrospective.history.v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage full / unavailable — fail silently, app keeps working in-memory
  }
}

export const storage = {
  loadPool(): string[] {
    const pool = read<string[]>(POOL_KEY, []);
    return Array.isArray(pool) ? pool.filter((n) => typeof n === "string" && n.trim().length > 0) : [];
  },
  savePool(names: string[]): void {
    write(POOL_KEY, names);
  },
  loadHistory(): RetrospectiveSnapshot[] {
    const history = read<RetrospectiveSnapshot[]>(HISTORY_KEY, []);
    return Array.isArray(history) ? history : [];
  },
  saveHistory(history: RetrospectiveSnapshot[]): void {
    write(HISTORY_KEY, history);
  },
};
