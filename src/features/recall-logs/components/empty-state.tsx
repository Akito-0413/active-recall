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
              className="inline-flex rounded-full bg-stone-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-stone-700"
            >
              {ctaLabel}
            </Link>
          </div>
        ) : null}
      </div>
    </div>
  );
}
