import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import type { ActiveRetrospective, FeedbackItem, RetrospectiveSnapshot } from "./types";
import { storage } from "./storage";
import { shuffle, uid } from "./lib";

interface RetrospectiveContextValue {
  pool: string[];
  history: RetrospectiveSnapshot[];
  active: ActiveRetrospective | null;
  startRetrospective: (sprintName: string, participants: string[]) => string;
  closeRetrospective: () => RetrospectiveSnapshot | null;
  addParticipant: (name: string) => void;
  deferParticipant: (name: string) => void;
  rateParticipant: (name: string, value: number) => void;
  addFeedback: (kind: FeedbackItem["kind"], text: string) => void;
  removeFeedback: (id: string) => void;
  recallFeedback: () => void;
  deleteRetrospective: (id: string) => void;
}

const RetrospectiveContext = createContext<RetrospectiveContextValue | null>(null);

function pendingOf(a: ActiveRetrospective): string[] {
  const deferred = new Set(a.deferred);
  const rated = new Set(Object.keys(a.ratings));
  return a.participants.filter((p) => !rated.has(p) && !deferred.has(p));
}

function nextPending(a: ActiveRetrospective): string | null {
  const pending = pendingOf(a);
  if (pending.length === 0) return null;
  return shuffle(pending)[0];
}

export function RetrospectiveProvider({ children }: { children: ReactNode }) {
  const [pool, setPool] = useState<string[]>(() => storage.loadPool());
  const [history, setHistory] = useState<RetrospectiveSnapshot[]>(() => storage.loadHistory());
  const [active, setActive] = useState<ActiveRetrospective | null>(null);

  const value = useMemo<RetrospectiveContextValue>(
    () => ({
      pool,
      history,
      active,

      startRetrospective: (sprintName, participants) => {
        const id = uid();
        setActive({
          id,
          sprintName,
          date: new Date().toISOString(),
          participants,
          deferred: [],
          ratings: {},
          feedback: [],
          currentName: participants.length > 0 ? shuffle(participants)[0] : null,
        });
        return id;
      },

      closeRetrospective: () => {
        if (!active) return null;
        const snapshot: RetrospectiveSnapshot = {
          id: active.id,
          sprintName: active.sprintName,
          date: active.date,
          participants: active.participants,
          ratings: active.ratings,
          feedback: active.feedback,
        };
        setHistory((h) => [snapshot, ...h]);
        setActive(null);
        return snapshot;
      },

      addParticipant: (name) => {
        const clean = name.trim();
        if (!clean) return;
        setPool((p) => (p.some((n) => n.toLowerCase() === clean.toLowerCase()) ? p : [...p, clean]));
        setActive((a) => {
          if (!a) return a;
          if (a.participants.some((p) => p.toLowerCase() === clean.toLowerCase())) return a;
          const participants = [...a.participants, clean];
          const stillPending = pendingOf({ ...a, participants });
          const currentName =
            stillPending.length > 0 && a.currentName === null ? stillPending[0] : a.currentName;
          return { ...a, participants, currentName };
        });
      },

      deferParticipant: (name) => {
        setActive((a) => {
          if (!a) return a;
          if (a.deferred.includes(name)) return a;
          const deferred = [...a.deferred, name];
          const next =
            a.currentName === name
              ? nextPending({ ...a, deferred })
              : a.currentName;
          return { ...a, deferred, currentName: next };
        });
      },

      rateParticipant: (name, value) => {
        setActive((a) => {
          if (!a) return a;
          const ratings = { ...a.ratings, [name]: value };
          const deferred = a.deferred.filter((d) => d !== name);
          const next = nextPending({ ...a, deferred, ratings });
          return { ...a, ratings, deferred, currentName: next };
        });
      },

      addFeedback: (kind, text) => {
        const clean = text.trim();
        if (!clean) return;
        const item: FeedbackItem = { id: uid(), kind, text: clean };
        setActive((a) => (a ? { ...a, feedback: [...a.feedback, item] } : a));
      },

      removeFeedback: (id) => {
        setActive((a) => (a ? { ...a, feedback: a.feedback.filter((f) => f.id !== id) } : a));
      },

      recallFeedback: () => {
        setActive((a) => {
          if (!a) return a;
          const last = history[0];
          const items = last ? last.feedback.map((f) => ({ ...f })) : [];
          return { ...a, feedback: items };
        });
      },

      deleteRetrospective: (id) => {
        setHistory((h) => h.filter((r) => r.id !== id));
      },
    }),
    [pool, history, active],
  );

  return <RetrospectiveContext.Provider value={value}>{children}</RetrospectiveContext.Provider>;
}

export function useRetrospective(): RetrospectiveContextValue {
  const ctx = useContext(RetrospectiveContext);
  if (!ctx) throw new Error("useRetrospective must be used inside RetrospectiveProvider");
  return ctx;
}
