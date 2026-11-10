import { useState } from "react";
import { ArrowLeft, Play, Plus, Rocket, Users, X } from "lucide-react";
import { useRetrospective } from "../state";
import { navigate } from "../router";

export default function PrepareRetrospective() {
  const { pool, history, startRetrospective } = useRetrospective();
  const lastRetro = history[0];
  const [sprintName, setSprintName] = useState("");
  const [selected, setSelected] = useState<string[]>(() => lastRetro?.participants ?? []);
  const [nameInput, setNameInput] = useState("");

  const addFromPool = (name: string) => {
    if (!selected.includes(name)) setSelected((s) => [...s, name]);
  };

  const addCustom = () => {
    const name = nameInput.trim();
    if (!name) return;
    if (!selected.includes(name)) setSelected((s) => [...s, name]);
    setNameInput("");
  };

  const start = () => {
    const sprint = sprintName.trim() || "Sprint retrospective";
    const id = startRetrospective(sprint, selected);
    navigate({ name: "ongoing", id });
  };

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-10">
      <button
        onClick={() => navigate({ name: "dashboard" })}
        className="mb-6 inline-flex items-center gap-2 rounded-2xl bg-white px-4 py-2.5 font-display font-bold text-ink shadow-sm transition active:scale-95"
      >
        <ArrowLeft className="h-5 w-5" />
        Dashboard
      </button>

      <section className="card-in rounded-3xl border border-ink/5 bg-white p-6 retro-shadow">
        <h1 className="font-display text-3xl font-extrabold text-ink">Prepare the next retro 🚀</h1>
        <p className="mt-1 text-sm font-semibold text-ink/55">
          Name the sprint and gather the crew before launch.
        </p>

        <label className="mt-6 block">
          <span className="mb-2 block font-display text-lg font-bold text-ink">Sprint name / number</span>
          <input
            value={sprintName}
            onChange={(e) => setSprintName(e.target.value)}
            placeholder="Sprint 12"
            className="w-full rounded-2xl border-2 border-cream-deep bg-cream/60 px-4 py-3 font-display text-xl font-bold text-ink outline-none transition focus:border-sun"
          />
        </label>

        <div className="mt-6">
          <p className="mb-3 flex items-center gap-2 font-display text-lg font-bold text-ink">
            <Users className="h-5 w-5 text-lavender" />
            Add participants
          </p>

          <div className="flex gap-2">
            <input
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCustom()}
              placeholder="Type a name…"
              className="flex-1 rounded-2xl border-2 border-cream-deep bg-cream/60 px-4 py-3 font-display font-bold text-ink outline-none transition focus:border-sun"
            />
            <button
              onClick={addCustom}
              disabled={!nameInput.trim()}
              className="inline-flex items-center gap-2 rounded-2xl bg-ink px-5 py-3 font-display font-bold text-cream transition active:scale-95 disabled:opacity-40"
            >
              <Plus className="h-5 w-5" />
              Add
            </button>
          </div>

          {pool.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-ink/45">From your pool</p>
              <div className="flex flex-wrap gap-2">
                {pool.map((name) => {
                  const added = selected.includes(name);
                  return (
                    <button
                      key={name}
                      onClick={() => addFromPool(name)}
                      className={`rounded-full px-4 py-2 font-display font-bold transition active:scale-95 ${
                        added
                          ? "bg-ink text-cream"
                          : "bg-cream-deep text-ink hover:bg-cream"
                      }`}
                    >
                      {added ? `✓ ${name}` : name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6">
          <p className="mb-3 font-display text-lg font-bold text-ink">Squad</p>
          {selected.length === 0 ? (
            <p className="rounded-2xl bg-cream/60 p-4 text-sm font-semibold text-ink/45">
              No one selected yet — add at least one participant to start.
            </p>
          ) : (
            <ul className="space-y-2">
              {selected.map((name) => (
                <li
                  key={name}
                  className="flex items-center justify-between rounded-2xl bg-cream/70 px-4 py-2.5"
                >
                  <span className="font-display font-bold text-ink">{name}</span>
                  <button
                    onClick={() => setSelected((s) => s.filter((n) => n !== name))}
                    className="rounded-full p-1.5 text-ink/50 transition hover:bg-berry/15 hover:text-berry active:scale-90"
                    aria-label={`Remove ${name}`}
                  >
                    <X className="h-4 w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-ink/50">{selected.length} participant{selected.length === 1 ? "" : "s"} in the squad</p>
          <button
            onClick={start}
            disabled={selected.length === 0}
            className="inline-flex items-center gap-2 rounded-2xl bg-chili px-7 py-3.5 font-display text-lg font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95 disabled:opacity-40"
          >
            <Play className="h-5 w-5" />
            Start retrospective
          </button>
        </div>
      </section>

      <div className="mt-6 flex items-center justify-center gap-2 text-center">
        <Rocket className="h-4 w-4 text-sun" />
        <p className="text-xs font-bold text-ink/40">Your squad will be picked in a surprise order. Fair is fair.</p>
      </div>
    </div>
  );
}
