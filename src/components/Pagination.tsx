import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  isDisabled?: boolean;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  isDisabled,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const getPageNumbers = (): (number | "ellipsis")[] => {
    const delta = 1;
    const range: number[] = [];
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }
    const pages: (number | "ellipsis")[] = [1];
    if (range[0] > 2) pages.push("ellipsis");
    pages.push(...range);
    if (range[range.length - 1] < totalPages - 1) pages.push("ellipsis");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  const pages = getPageNumbers();

  const btnBase: React.CSSProperties = {
    width: "36px",
    height: "36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 500,
    transition: "all 0.2s ease",
    cursor: isDisabled ? "not-allowed" : "pointer",
    opacity: isDisabled ? 0.5 : 1,
  };

  return (
    <nav className="flex items-center justify-center gap-1 flex-wrap">
      {/* prev button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1 || isDisabled}
        style={{
          ...btnBase,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid var(--border)",
          color: currentPage === 1 ? "var(--text-muted)" : "var(--text-main)",
        }}
      >
        <ChevronLeft size={16} />
      </button>

      {/* page numbers */}
      {pages.map((p, idx) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${idx}`}
            style={{ padding: "0 4px", color: "var(--text-muted)" }}
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            disabled={isDisabled}
            style={{
              ...btnBase,
              background:
                p === currentPage ? "var(--primary)" : "rgba(255,255,255,0.6)",
              color: p === currentPage ? "white" : "var(--text-main)",
              border: `1px solid ${p === currentPage ? "transparent" : "var(--border)"}`,
            }}
          >
            {p}
          </button>
        ),
      )}

      {/* next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages || isDisabled}
        style={{
          ...btnBase,
          background: "rgba(255,255,255,0.6)",
          border: "1px solid var(--border)",
          color:
            currentPage === totalPages
              ? "var(--text-muted)"
              : "var(--text-main)",
        }}
      >
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}
