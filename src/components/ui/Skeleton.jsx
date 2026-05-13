export function SkeletonRow({ cols = 5 }) {
  return (
    <tr className="border-b border-[var(--border-dim)]">
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <div className="h-4 rounded shimmer" style={{ width: `${60 + Math.random() * 30}%` }} />
        </td>
      ))}
    </tr>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass rounded-xl p-6 space-y-3">
      <div className="h-3 w-1/3 rounded shimmer" />
      <div className="h-8 w-2/3 rounded shimmer" />
      <div className="h-3 w-1/2 rounded shimmer" />
    </div>
  );
}

export function SkeletonText({ lines = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className={`h-3 rounded shimmer`} style={{ width: `${50 + Math.random() * 40}%` }} />
      ))}
    </div>
  );
}
