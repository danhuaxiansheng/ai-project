"use client";

interface TaskResultProps {
  result: string;
}

export function TaskResult({ result }: TaskResultProps) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <pre className="whitespace-pre-wrap text-sm">{result}</pre>
    </div>
  );
}
