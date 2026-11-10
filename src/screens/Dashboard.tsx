import { CalendarHeart, Plus, Rocket, Star, Users } from "lucide-react";
import { useRetrospective } from "../state";
import { averageRating, formatDate } from "../lib";

export default function Dashboard() {
  const { history, pool } = useRetrospective();

  const openRetrospective = (id: string) => {
    window.location.hash = `#/retrospective/${encodeURIComponent(id)}`;
  };

  const createNew = () => {
    window.location.hash = "#/new";
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <header className="mb-10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="retro-shadow-pop flex h-12 w-12 items-center justify-center rounded-2xl bg-chili text-2xl shadow-lg shadow-chili/40">
            <Rocket className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink">Retro Rocket</h1>
            <p className="text-sm font-semibold text-ink/50">agile retrospectives, launched with joy</p>
          </div>
        </div>
        <button
          onClick={createNew}
          className="inline-flex items-center gap-2 rounded-2xl bg-chili px-5 py-3 font-display font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95"
        >
          <Plus className="h-5 w-5" />
          New retrospective
        </button>
      </header>

      <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-sun/20">
            <CalendarHeart className="h-5 w-5 text-sun" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">Your retrospectives</h2>
            <p className="text-sm font-semibold text-ink/50">
              {history.length === 0
                ? "No retrospectives yet — launch your first one!"
                : `${history.length} retro${history.length === 1 ? "" : "s"} sailed since launch`}
            </p>
          </div>
        </div>

        {history.length === 0 ? (
          <div className="mt-6 rounded-2xl border-2 border-dashed border-cream-deep bg-cream/60 p-8 text-center">
            <p className="font-display text-2xl font-bold text-ink">Ready for lift-off? 🚀</p>
            <p className="mt-1 text-sm font-semibold text-ink/55">
              Start a new retrospective to collect ratings and feedback from your team.
            </p>
            <button
              onClick={createNew}
              className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-ink px-6 py-3 font-display font-bold text-cream shadow-lg transition active:scale-95"
            >
              <Rocket className="h-5 w-5" />
              Start a retrospective
            </button>
          </div>
        ) : (
          <ul className="mt-5 space-y-3">
            {history.map((r) => {
              const avg = averageRating(r.ratings);
              const ratedCount = Object.keys(r.ratings).length;
              return (
                <li key={r.id}>
                  <button
                    onClick={() => openRetrospective(r.id)}
                    className="group w-full rounded-2xl border border-ink/5 bg-cream/70 p-4 text-left transition hover:border-sun/60 hover:bg-white active:scale-[0.99]"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-display text-lg font-bold text-ink group-hover:text-chili">
                          {r.sprintName}
                        </p>
                        <p className="text-xs font-semibold text-ink/50">{formatDate(r.date)}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        {avg !== null ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sun/15 px-3 py-1 font-display font-bold text-amber-700">
                            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                            {avg}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-cream-deep px-3 py-1 font-display font-bold text-ink/50">
                            no ratings yet
                          </span>
                        )}
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-ink/50">
                          <Users className="h-4 w-4" />
                          {ratedCount}/{r.participants.length}
                        </span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {pool.length > 0 && (
        <section className="card-in mt-6 rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
          <h2 className="font-display text-xl font-bold text-ink">Participant pool</h2>
          <p className="mt-1 text-sm font-semibold text-ink/50">
            Everyone you've ever added — one tap to reuse.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {pool.map((name) => (
              <button
                key={name}
                onClick={createNew}
                className="rounded-full bg-cream-deep px-4 py-2 font-display font-bold text-ink transition active:scale-95 hover:bg-cream"
              >
                {name}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
