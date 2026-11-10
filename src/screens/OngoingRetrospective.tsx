import { useState } from "react";
import { ArrowLeft, CheckCircle2, Flag, Lightbulb, MessageSquareHeart, Plus, RotateCcw, Star, Users, X } from "lucide-react";
import { useRetrospective, pendingOf } from "../state";
import { averageRating, formatDateTime } from "../lib";
import { navigate } from "../router";
import Avatar from "../components/Avatar";
import RatingInput from "../components/RatingInput";

export default function OngoingRetrospective({ id }: { id: string }) {
  const { pool, history, active, addParticipant, deferParticipant, rateParticipant, addFeedback, removeFeedback, closeRetrospective } = useRetrospective();
  const [nameInput, setNameInput] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackKind, setFeedbackKind] = useState<"feedback" | "action">("feedback");
  const [recallOpen, setRecallOpen] = useState(false);
  const [selectedRecallIds, setSelectedRecallIds] = useState<string[]>([]);

  if (!active || active.id !== id) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16 text-center">
        <p className="font-display text-3xl font-bold text-ink">No retrospective in flight 🚀</p>
        <p className="mt-2 text-sm font-semibold text-ink/55">Start a new one to collect feedback.</p>
        <button
          onClick={() => navigate({ name: "prepare" })}
          className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-chili px-6 py-3 font-display font-bold text-white"
        >
          Start a retrospective
        </button>
      </div>
    );
  }

  const deferred = new Set(active.deferred);
  const rated = new Set(Object.keys(active.ratings));
  const pending = pendingOf(active);
  const avg = averageRating(active.ratings);
  const lastRetro = history[0];
  const done = pending.length === 0;

  const handleAdd = () => {
    if (nameInput.trim()) {
      addParticipant(nameInput);
      setNameInput("");
    }
  };

  const handleClose = () => {
    closeRetrospective();
    navigate({ name: "dashboard" });
  };

  const handleOpenRecall = () => {
    setRecallOpen(true);
    setSelectedRecallIds((lastRetro?.feedback ?? []).map((f) => f.id));
  };

  const handleCloseRecall = () => {
    const items = lastRetro?.feedback ?? [];
    for (const f of items) {
      if (selectedRecallIds.includes(f.id)) {
        addFeedback(f.kind, f.text);
      }
    }
    setRecallOpen(false);
  };

  const handleAddFeedback = () => {
    if (!feedbackText.trim()) return;
    addFeedback(feedbackKind, feedbackText);
    setFeedbackText("");
  };

  const toggleRecallItem = (id: string) => {
    setSelectedRecallIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleAddFromPool = (name: string) => {
    addParticipant(name);
  };

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-16 pt-10">
      <div className="mb-6 flex items-center justify-between gap-3">
        <button
          onClick={() => navigate({ name: "dashboard" })}
          className="inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-display font-bold text-ink shadow-sm transition active:scale-95"
        >
          <ArrowLeft className="h-5 w-5" />
          Dashboard
        </button>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-sun/20 px-3 py-1.5 font-display font-bold text-amber-700">
          <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
          avg {avg !== null ? avg.toFixed(1) : "–"}
        </span>
      </div>

      <div className="flex flex-col gap-6 lg:flex-row">
        {/* First column — wider: collect a rating, then feedback / action items */}
        <div className="w-full lg:w-2/3 space-y-6">
          <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
            <h2 className="font-display text-xl font-bold text-ink">Collect a rating</h2>

            {done ? (
              <div className="mt-6 rounded-3xl bg-mint/10 p-8 text-center">
                <CheckCircle2 className="mx-auto h-12 w-12 text-mint" />
                <p className="mt-3 font-display text-3xl font-extrabold text-ink">All done! 🎉</p>
                <p className="mt-1 font-display font-bold text-ink/60">
                  Every participant has shared their feeling. Time to gather the wisdom.
                </p>
                <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
                  <button
                    onClick={() => navigate({ name: "dashboard" })}
                    className="rounded-2xl bg-ink px-6 py-3 font-display font-bold text-cream transition active:scale-95"
                  >
                    View in dashboard
                  </button>
                  <button
                    onClick={handleClose}
                    className="rounded-2xl bg-chili px-6 py-3 font-display font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95"
                  >
                    Close &amp; save retro
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="mt-5 flex items-center gap-4 rounded-2xl bg-cream/70 p-4">
                  <Avatar name={active.currentName ?? ""} size="lg" />
                  <div>
                    <p className="font-display text-2xl font-extrabold text-ink">{active.currentName}</p>
                    <p className="text-sm font-semibold text-ink/50">
                      {pending.length} feeling{pending.length === 1 ? "" : "s"} still pending · random order, fair is fair
                    </p>
                  </div>
                </div>

                <RatingInput participantKey={active.currentName ?? ""} value={active.ratings[active.currentName ?? ""] ?? null} onChange={(v) => rateParticipant(active.currentName ?? "", v)} />

                <div className="mt-5 flex justify-center gap-3">
                  <button
                    onClick={() => active.currentName && deferParticipant(active.currentName)}
                    className="rounded-2xl bg-cream-deep px-6 py-3 font-display font-bold text-ink transition active:scale-95 hover:bg-cream"
                  >
                    ⏸ Defer
                  </button>
                  <button
                    onClick={() => active.currentName && rateParticipant(active.currentName, 10)}
                    className="rounded-2xl bg-mint px-6 py-3 font-display font-bold text-white shadow-lg shadow-mint/40 transition active:scale-95"
                  >
                    😍 Rate 10
                  </button>
                </div>
              </>
            )}
          </section>

          <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <MessageSquareHeart className="h-6 w-6 text-berry" />
                Feedback &amp; action items
              </h2>
              {lastRetro && (
                <button
                  onClick={handleOpenRecall}
                  className="inline-flex items-center gap-1.5 rounded-full bg-lavender/15 px-3 py-1.5 font-display font-bold text-lavender transition active:scale-95"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  Recall last retro
                </button>
              )}
            </div>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-cream/70 p-1.5">
              <button
                onClick={() => setFeedbackKind("feedback")}
                className={`rounded-xl px-3 py-2 font-display font-bold transition ${
                  feedbackKind === "feedback" ? "bg-white text-ink shadow-sm" : "text-ink/50"
                }`}
              >
                💬 Feedback
              </button>
              <button
                onClick={() => setFeedbackKind("action")}
                className={`rounded-xl px-3 py-2 font-display font-bold transition ${
                  feedbackKind === "action" ? "bg-white text-ink shadow-sm" : "text-ink/50"
                }`}
              >
                ⚡ Action
              </button>
            </div>

            <div className="mt-4 flex gap-2">
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder={feedbackKind === "action" ? "What should we do next sprint?" : "What went well? What felt off?"}
                rows={3}
                className="min-h-[72px] w-full resize-none rounded-2xl border-2 border-cream-deep bg-cream/60 px-4 py-3 font-body font-semibold text-ink outline-none transition focus:border-sun"
              />
              <button
                onClick={handleAddFeedback}
                disabled={!feedbackText.trim()}
                className="self-start rounded-2xl bg-chili px-5 py-3 font-display font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>

            {active.feedback.length > 0 && (
              <ul className="mt-4 space-y-2">
                {active.feedback.map((f) => (
                  <li
                    key={f.id}
                    className={`flex items-start justify-between gap-3 rounded-2xl px-4 py-3 text-sm font-semibold ${
                      f.kind === "action" ? "bg-mint/15 text-teal-800" : "bg-cream-deep text-ink"
                    }`}
                  >
                    <span className="flex items-start gap-2">
                      {f.kind === "action" ? <Lightbulb className="mt-0.5 h-4 w-4 shrink-0" /> : <MessageSquareHeart className="mt-0.5 h-4 w-4 shrink-0" />}
                      {f.text}
                    </span>
                    <button
                      onClick={() => removeFeedback(f.id)}
                      className="rounded-full p-1 text-ink/40 transition hover:bg-berry/15 hover:text-berry active:scale-90"
                      aria-label="Remove feedback"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Second column — narrower: sprint retrospective, then participants */}
        <div className="w-full lg:w-1/3 space-y-6">
          <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
            <p className="text-xs font-bold uppercase tracking-widest text-ink/45">In flight</p>
            <h1 className="font-display text-3xl font-extrabold text-ink">{active.sprintName}</h1>
            <p className="mt-1 flex items-center gap-2 text-sm font-semibold text-ink/55">
              <Flag className="h-4 w-4" />
              started {formatDateTime(active.date)}
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={handleOpenRecall}
                disabled={!lastRetro}
                className="inline-flex items-center gap-2 rounded-2xl bg-lavender/15 px-4 py-2.5 font-display font-bold text-lavender transition active:scale-95 disabled:opacity-40"
              >
                <RotateCcw className="h-4 w-4" />
                Recall feedback from previous retro
              </button>
              <button
                onClick={handleClose}
                className="inline-flex items-center gap-2 rounded-2xl bg-chili px-5 py-2.5 font-display font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95"
              >
                <CheckCircle2 className="h-4 w-4" />
                Close retrospective
              </button>
            </div>
          </section>

          <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
            <div className="flex items-center justify-between gap-3">
              <h2 className="flex items-center gap-2 font-display text-xl font-bold text-ink">
                <Users className="h-6 w-6 text-lavender" />
                Participants
              </h2>
              <span className="rounded-full bg-cream-deep px-3 py-1 font-display font-bold text-ink/60">
                {active.participants.length} in squad
              </span>
            </div>

            <div className="mt-3 flex items-center justify-between rounded-2xl bg-sun/10 px-4 py-3">
              <span className="font-display font-bold text-ink">Current average</span>
              <span className="font-display text-2xl font-extrabold text-amber-700">
                {avg !== null ? avg.toFixed(1) : "–"}
              </span>
            </div>

            <ul className="mt-4 space-y-2">
              {[...active.participants]
                .sort((a, b) => a.localeCompare(b))
                .map((p) => {
                  const isDeferred = deferred.has(p);
                  const isRated = rated.has(p);
                  return (
                    <li
                      key={p}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-cream/70 px-4 py-2.5"
                    >
                      <span className="flex items-center gap-3 font-display font-bold text-ink">
                        <Avatar name={p} size="sm" />
                        {p}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 font-display font-bold text-sm ${
                          isRated
                            ? "bg-mint/15 text-teal-800"
                            : isDeferred
                              ? "bg-cream-deep text-ink/40 line-through"
                              : "bg-cream-deep text-ink/60"
                        }`}
                      >
                        {isRated ? active.ratings[p] : isDeferred ? "deferred" : "pending"}
                      </span>
                    </li>
                  );
                })}
            </ul>

            <div className="mt-5 flex gap-2">
              <input
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleAdd()}
                placeholder="Add a participant…"
                className="flex-1 rounded-2xl border-2 border-cream-deep bg-cream/60 px-4 py-2.5 font-display font-bold text-ink outline-none transition focus:border-sun"
              />
              <button
                onClick={handleAdd}
                disabled={!nameInput.trim()}
                className="inline-flex items-center gap-2 rounded-2xl bg-ink px-4 py-2.5 font-display font-bold text-cream transition active:scale-95 disabled:opacity-40"
              >
                <Plus className="h-5 w-5" />
                Add
              </button>
            </div>
            {pool.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {pool
                  .filter((p) => !active.participants.some((ap) => ap.toLowerCase() === p.toLowerCase()))
                  .map((p) => (
                    <button
                      key={p}
                      onClick={() => handleAddFromPool(p)}
                      className="rounded-full bg-cream-deep px-3 py-1.5 font-display font-bold text-ink/70 transition active:scale-95 hover:bg-cream"
                    >
                      + {p}
                    </button>
                  ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {recallOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4">
          <div className="card-in w-full max-w-md rounded-3xl border border-ink/5 bg-white p-6 retro-shadow-pop">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-ink/45">Recall</p>
                <h2 className="font-display text-2xl font-extrabold text-ink">From previous retro</h2>
                <p className="mt-1 text-sm font-semibold text-ink/55">
                  {lastRetro?.sprintName} · {(lastRetro?.feedback ?? []).length} item{(lastRetro?.feedback ?? []).length === 1 ? "" : "s"}
                </p>
              </div>
              <button
                onClick={handleCloseRecall}
                className="rounded-full p-1.5 text-ink/50 transition hover:bg-cream-deep hover:text-berry active:scale-90"
                aria-label="Close recall pop-up"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <ul className="mt-4 max-h-72 space-y-2 overflow-y-auto">
              {(lastRetro?.feedback ?? []).map((f) => (
                <li key={f.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-cream/70 px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selectedRecallIds.includes(f.id)}
                      onChange={() => toggleRecallItem(f.id)}
                      className="mt-1 h-5 w-5 accent-chili"
                    />
                    <span className="text-sm font-semibold text-ink">{f.text}</span>
                  </label>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex justify-end">
              <button
                onClick={handleCloseRecall}
                className="rounded-2xl bg-chili px-6 py-3 font-display font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95"
              >
                Close &amp; add selected
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
