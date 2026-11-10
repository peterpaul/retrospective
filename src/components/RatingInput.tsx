import { useEffect, useState } from "react";

interface RatingInputProps {
  value: number | null;
  onChange: (value: number) => void;
  participantKey?: string;
}

const QUICK_PICKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export default function RatingInput({ value, onChange, participantKey }: RatingInputProps) {
  const [draft, setDraft] = useState<string>(value !== null ? String(value) : "");

  // Reset the draft whenever the participant changes (or on mount).
  useEffect(() => {
    setDraft(value !== null ? String(value) : "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantKey]);

  const parsed = Number.parseInt(draft, 10);
  const display = Number.isNaN(parsed) ? null : parsed;

  const apply = () => {
    if (display === null) return;
    const clamped = Math.min(10, Math.max(1, display));
    onChange(clamped);
    setDraft(""); // reset the selected answer after it has been applied
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-end justify-center gap-3">
        <button
          type="button"
          onClick={apply}
          disabled={display === null}
          aria-label="Apply rating"
          className={`font-display text-7xl font-extrabold leading-none transition-colors ${
            display !== null ? "text-chili" : "text-ink/25"
          } disabled:cursor-not-allowed`}
        >
          {display ?? "?"}
        </button>
        <div className="pb-1 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-ink/50">
            {display !== null ? "feeling score · click to apply" : "tap a number"}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-1.5">
        {QUICK_PICKS.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => setDraft(String(n))}
            aria-label={`Select rating ${n}`}
            className={`h-10 w-10 rounded-full font-display text-base font-bold transition-all active:scale-90 ${
              display === n
                ? n <= 3
                  ? "bg-chili text-white shadow-lg shadow-chili/40 scale-110"
                  : n >= 8
                    ? "bg-mint text-white shadow-lg shadow-mint/40 scale-110"
                    : "bg-sun text-ink shadow-lg shadow-sun/50 scale-110"
                : "bg-cream-deep text-ink/60 hover:bg-cream active:scale-90"
            }`}
          >
            {n}
          </button>
        ))}
      </div>

      <input
        type="number"
        min={1}
        max={10}
        step={1}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        placeholder="?"
        aria-label="Rating from 1 to 10"
        className="mt-4 w-full rounded-2xl border-2 border-cream-deep bg-white px-4 py-2.5 text-center font-display text-2xl font-bold text-ink shadow-sm outline-none transition focus:border-chili"
      />

      <div className="mt-4 flex justify-center">
        <button
          type="button"
          onClick={apply}
          disabled={display === null}
          className="inline-flex items-center gap-2 rounded-2xl bg-chili px-6 py-3 font-display text-lg font-bold text-white shadow-lg shadow-chili/40 transition active:scale-95 disabled:opacity-40"
        >
          Apply rating
        </button>
      </div>

      <p className="mt-2 text-center text-xs font-semibold text-ink/40">Rating scale: 1 = rough, 10 = lovely</p>
    </div>
  );
}
