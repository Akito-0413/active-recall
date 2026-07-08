import Link from "next/link";

type EmptyStateProps = {
  title: string;
  description: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function EmptyState({
  title,
  description,
  ctaHref,
  ctaLabel,
}: EmptyStateProps) {
  return (
    <div className="rounded-2xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center shadow-sm">
      <div className="mx-auto max-w-xl space-y-3">
        <h2 className="text-xl font-semibold text-stone-950">{title}</h2>
        <p className="text-sm leading-6 text-stone-600 sm:text-base">
          {description}
        </p>
        {ctaHref && ctaLabel ? (
          <div className="pt-3">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 rounded-full border border-stone-800 bg-stone-800 px-5 py-3 text-sm font-medium text-white shadow-[0_10px_24px_rgba(41,37,36,0.12)] transition hover:bg-stone-700"
            >
              <span className="text-white">{ctaLabel}</span>
              <span
                aria-hidden="true"
                className="text-base leading-none text-white"
              >
                {"->"}
              </span>
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
