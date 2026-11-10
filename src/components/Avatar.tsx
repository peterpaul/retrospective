interface AvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
}

const SIZES = {
  sm: "h-8 w-8 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-16 w-16 text-lg",
} as const;

export default function Avatar({ name, size = "md" }: AvatarProps) {
  const initials = name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const palette = [
    "bg-chili",
    "bg-berry",
    "bg-sun",
    "bg-mint",
    "bg-lavender",
    "bg-sky",
  ];
  let hash = 0;
  for (const ch of name) hash = (hash * 31 + ch.charCodeAt(0)) % 997;
  const bg = palette[hash % palette.length];

  return (
    <div
      className={`${bg} flex shrink-0 items-center justify-center rounded-full font-display font-bold text-white shadow-md ring-2 ring-white/70 ${SIZES[size]}`}
      aria-hidden="true"
    >
      {initials || "?"}
    </div>
  );
}
