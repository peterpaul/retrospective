import { useState } from "react";
import { ArrowLeft, CalendarHeart, Star, Trash2, Users } from "lucide-react";
import { useRetrospective } from "../state";
import { averageRating, formatDateTime } from "../lib";
import { navigate } from "../router";
import Avatar from "../components/Avatar";

export default function PreviousRetrospective({ id }: { id: string }) {
  const { history, deleteRetrospective } = useRetrospective();
  const [confirming, setConfirming] = useState(false);

  const retro = history.find((r) => r.id === id);

  if (!retro) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-3xl font-bold text-ink">Retro not found 🚀</p>
        <p className="mt-2 text-sm font-semibold text-ink/55">It may have been forgotten.</p>
        <button
          onClick={() => navigate({ name: "dashboard" })}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 font-display font-bold text-cream"
        >
          <ArrowLeft className="h-5 w-5" />
          Back to dashboard
        </button>
      </div>
    );
  }

  const avg = averageRating(retro.ratings);
  const feedback = [...retro.feedback].sort((a, b) =>
    a.kind === b.kind ? 0 : a.kind === "action" ? -1 : 1,
  );

  const handleDelete = () => {
    deleteRetrospective(retro.id);
    navigate({ name: "dashboard" });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <button
          onClick={() => navigate({ name: "dashboard" })}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-display font-bold text-ink shadow-sm transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          Dashboard
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-mint/15 px-3 py-1.5 font-display font-bold text-teal-700">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          avg {avg !== null ? avg.toFixed(1) : "–"}
        </span>
      </div>

      <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/45">Retrospective</p>
            <h1 className="font-display text-3xl font-extrabold text-ink">{retro.sprintName}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink/55">
              <CalendarHeart className="h-4 w-4" />
              {formatDateTime(retro.date)}
            </p>
          </div>
          <div className="text-right">
            <p className="font-display text-5xl font-extrabold leading-none text-chili">{avg ?? "–"}</p>
            <p className="text-xs font-bold uppercase tracking-widest text-ink/45">average feeling</p>
          </div>
        </div>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Users className="h-5 w-5 text-lavender" />
            Participants
          </p>
          <ul className="space-y-2">
            {retro.participants.map((p) => (
              <li
                key={p}
                className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-2.5"
              >
                <span className="flex items-center gap-3 font-display font-bold text-ink">
                  <Avatar name={p} size="sm" />
                  {p}
                </span>
                <span className="rounded-full bg-white px-3 py-1 font-display font-bold text-chili shadow-sm">
                  {retro.ratings[p] ?? "–"}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-6">
          <p className="mb-3 font-display text-lg font-bold text-ink">Feedback &amp; action items</p>
          {feedback.length === 0 ? (
            <p className="rounded-2xl bg-cream/60 p-4 text-sm font-semibold text-ink/45">
              Nothing was captured this time — the team was well aligned!
            </p>
          ) : (
            <ul className="space-y-2">
              {feedback.map((f) => (
                <li
                  key={f.id}
                  className={`rounded-2xl px-4 py-3 text-sm font-semibold shadow-sm ${
                    f.kind === "action"
                      ? "bg-mint/15 text-teal-800"
                      : "bg-cream-deep text-ink"
                  }`}
                >
                  <span
                    className={`mr-2 inline-block rounded-full px-2 py-0.5 font-display text-[10px] font-bold uppercase tracking-wider ${
                      f.kind === "action" ? "bg-mint/30 text-teal-700" : "bg-ink/10 text-ink/70"
                    }`}
                  >
                    {f.kind === "action" ? "action" : "feedback"}
                  </span>
                  {f.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 border-t border-cream-deep pt-6">
          <p className="mb-3 font-display text-lg font-bold text-ink">Forget this retro?</p>
          {confirming ? (
            <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-berry/10 p-4">
              <p className="w-full text-sm font-bold text-berry">Really delete this retrospective? This cannot be undone.</p>
              <button
                onClick={handleDelete}
                className="inline-flex items-center gap-2 rounded-2xl bg-berry px-5 py-2.5 font-display font-bold text-white shadow-lg shadow-berry/40 transition active:scale-95"
              >
                <Trash2 className="h-4 w-4" />
                Yes, delete it
              </button>
              <button
                onClick={() => setConfirming(false)}
                className="rounded-2xl bg-cream-deep px-5 py-2.5 font-display font-bold text-ink transition active:scale-95"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-cream-deep px-5 py-2.5 font-display font-bold text-ink transition active:scale-95 hover:bg-cream"
            >
              <Trash2 className="h-4 w-4" />
              Delete / forget retrospective
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
