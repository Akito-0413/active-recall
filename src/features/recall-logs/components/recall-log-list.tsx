import Link from "next/link";

import { StatusBadge } from "@/features/recall-logs/components/status-badge";
import type { RecallLog } from "@/features/recall-logs/types";

type RecallLogListProps = {
  logs: RecallLog[];
  highlightPending?: boolean;
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

function sourceLabel(source: RecallLog["source"]) {
  return source === "manual" ? "手動登録" : "Custom GPT";
}

export function RecallLogList({
  logs,
  highlightPending = false,
}: RecallLogListProps) {
  return (
    <ul className="grid gap-4">
      {logs.map((log) => (
        <li key={log.id}>
          <Link
            href={`/logs/${log.id}`}
            className="block rounded-2xl border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow-md"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge reviewed={log.reviewed} />
                  <span className="text-xs font-medium text-stone-500">
                    {sourceLabel(log.source)}
                  </span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                    {log.bookTitle}
                  </h2>
                  <ul className="space-y-2 text-sm leading-6 text-stone-700">
                    {log.summaryPoints.slice(0, 2).map((point, index) => (
                      <li key={`${log.id}-${index}`} className="flex gap-2">
                        <span className="mt-2 h-1.5 w-1.5 rounded-full bg-stone-400" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="space-y-2 text-sm text-stone-500 sm:text-right">
                <p>作成日: {formatDate(log.createdAt)}</p>
                <p>
                  {highlightPending ? "復習待ち" : "更新日"}:{" "}
                  {formatDate(log.updatedAt)}
                </p>
              </div>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}
