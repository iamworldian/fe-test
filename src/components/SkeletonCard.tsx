export function SkeletonCard() {
  return (
    <div className="glass-card overflow-hidden">
      {/* image placeholder */}
      <div
        className="animate-pulse"
        style={{ aspectRatio: "4/3", background: "var(--surface-hover)" }}
      />
      <div className="p-4 flex flex-col gap-3">
        {/* title */}
        <div
          className="animate-pulse h-4 w-3/4 rounded"
          style={{ background: "var(--surface-hover)" }}
        />
        <div
          className="animate-pulse h-4 w-1/2 rounded"
          style={{ background: "var(--surface-hover)" }}
        />
        {/* description */}
        <div
          className="animate-pulse h-3 w-full rounded"
          style={{ background: "var(--surface-hover)" }}
        />
        <div
          className="animate-pulse h-3 w-4/5 rounded"
          style={{ background: "var(--surface-hover)" }}
        />
        {/* price row */}
        <div className="flex justify-between items-center pt-2">
          <div
            className="animate-pulse h-6 w-16 rounded"
            style={{ background: "var(--surface-hover)" }}
          />
          <div
            className="animate-pulse h-8 w-24 rounded-lg"
            style={{ background: "var(--surface-hover)" }}
          />
        </div>
      </div>
    </div>
  );
}
