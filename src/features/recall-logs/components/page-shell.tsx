import Link from "next/link";

type PageShellProps = {
  title: string;
  description: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
};

const navItems = [
  { href: "/logs", label: "ログ一覧" },
  { href: "/logs/new", label: "手動登録" },
  { href: "/review", label: "未復習" },
];

export function PageShell({
  title,
  description,
  actions,
  children,
}: PageShellProps) {
  return (
    <div className="min-h-screen bg-stone-100 text-stone-900">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-4 py-6 sm:px-6 lg:px-8">
        <header className="border-b border-stone-200 pb-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="space-y-3">
              <Link
                href="/logs"
                className="text-sm font-medium uppercase tracking-[0.18em] text-stone-500"
              >
                Active Recall
              </Link>
              <div className="space-y-2">
                <h1 className="text-3xl font-semibold tracking-tight text-stone-950">
                  {title}
                </h1>
                <p className="max-w-2xl text-sm leading-6 text-stone-600 sm:text-base">
                  {description}
                </p>
              </div>
            </div>
            {actions ? <div className="flex gap-3">{actions}</div> : null}
          </div>
          <nav className="mt-5 flex flex-wrap gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-full border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:text-stone-950"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="flex-1 py-6">{children}</main>
      </div>
    </div>
  );
}
