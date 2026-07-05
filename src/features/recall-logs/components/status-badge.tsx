type StatusBadgeProps = {
  reviewed: boolean;
};

export function StatusBadge({ reviewed }: StatusBadgeProps) {
  return (
    <span
      className={
        reviewed
          ? "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700"
          : "inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700"
      }
    >
      {reviewed ? "復習済み" : "未復習"}
    </span>
  );
}
