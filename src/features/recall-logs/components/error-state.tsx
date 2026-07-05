type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-2xl border border-rose-200 bg-rose-50 px-6 py-5 text-sm leading-6 text-rose-700">
      {message}
    </div>
  );
}
