import { useState, useCallback, useRef } from "react";
import {
  Search,
  AlertTriangle,
  RefreshCw,
  Loader2,
  SlidersHorizontal,
} from "lucide-react";
import { useProducts } from "./hooks/useProducts";
import { ProductCard } from "./components/ProductCard";
import { Pagination } from "./components/Pagination";
import { SkeletonCard } from "./components/SkeletonCard";

const CATEGORIES = ["Electronics", "Clothing", "Home", "Outdoors"];
const ITEMS_PER_PAGE = 12;

function App() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState("");
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  const handleCategoryChange = useCallback((val: string) => {
    setCategory(val);
    setPage(1);
  }, []);

  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearchInput = useCallback((val: string) => {
    setSearchInput(val);
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setSearch(val);
      setPage(1);
    }, 400);
  }, []);

  const { products, meta, isLoading, isRetrying, retryCount, error, retry } =
    useProducts({
      page,
      limit: ITEMS_PER_PAGE,
      category,
      search,
    });

  const skeletonCount = ITEMS_PER_PAGE;

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "2rem",
        maxWidth: "1400px",
        margin: "0 auto",
      }}
    >
      {/* ── Header ── */}
      <header
        className="glass-panel"
        style={{ padding: "2rem", marginBottom: "2rem" }}
      >
        <h1
          style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "0.5rem" }}
        >
          Premium Products
        </h1>
        <p style={{ color: "var(--text-muted)" }}>
          Browse our curated collection of premium items.
        </p>
      </header>

      {/* ── Controls ── */}
      <section
        style={{
          display: "flex",
          gap: "1rem",
          marginBottom: "2rem",
          flexWrap: "wrap",
        }}
      >
        {/* Search input */}
        <label
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0.75rem 1rem",
            flex: 1,
            minWidth: "200px",
            maxWidth: "400px",
            cursor: "text",
          }}
        >
          <Search
            size={18}
            color="var(--text-muted)"
            style={{ marginRight: "0.75rem", flexShrink: 0 }}
          />
          <input
            type="search"
            placeholder="Search products…"
            value={searchInput}
            onChange={(e) => handleSearchInput(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              outline: "none",
              width: "100%",
              fontSize: "1rem",
            }}
          />
        </label>

        {/* Category filter */}
        <div
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            padding: "0 1rem",
            gap: "0.5rem",
          }}
        >
          <SlidersHorizontal size={16} color="var(--text-muted)" />
          <select
            value={category}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--text-main)",
              outline: "none",
              fontSize: "1rem",
              cursor: "pointer",
              padding: "0.75rem 0",
            }}
          >
            <option value="" style={{ background: "var(--surface)" }}>
              All Categories
            </option>
            {CATEGORIES.map((cat) => (
              <option
                key={cat}
                value={cat}
                style={{ background: "var(--surface)" }}
              >
                {cat}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* ── Retrying banner ── */}
      {isRetrying && (
        <div
          role="status"
          className="glass-panel"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.75rem 1.25rem",
            marginBottom: "1.5rem",
            borderColor: "#f59e0b",
          }}
        >
          <Loader2
            size={16}
            color="#f59e0b"
            style={{ animation: "spin 1s linear infinite" }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <span style={{ color: "#92400e", fontSize: "0.875rem" }}>
            Network hiccup — retrying automatically ({retryCount}/{3})…
          </span>
        </div>
      )}

      {/* ── Pagination ── */}
      {!error && meta && meta.totalPages > 1 && (
        <div style={{ marginTop: "2.5rem" }}>
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            isDisabled={isLoading}
          />
          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              marginBottom: "1rem",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
            }}
          >
            Page {page} of {meta.totalPages}
          </p>
        </div>
      )}

      {/* ── Main grid ── */}
      <main>
        {/* Loading skeletons */}
        {isLoading && !isRetrying && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
              animation: "fadeIn 0.3s ease-in",
            }}
          >
            <style>{`@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
            {Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div
            className="glass-panel"
            style={{
              padding: "3rem",
              textAlign: "center",
              borderColor: "var(--error)",
            }}
            role="alert"
          >
            <AlertTriangle
              size={40}
              color="var(--error)"
              style={{ margin: "0 auto 1rem" }}
            />
            <h2 style={{ fontWeight: 600, marginBottom: "0.5rem" }}>
              Failed to Load Products
            </h2>
            <p
              style={{
                color: "var(--text-muted)",
                marginBottom: "1.5rem",
                fontSize: "0.9rem",
              }}
            >
              {error}
            </p>
            <button
              className="btn-primary flex items-center gap-2 mx-auto"
              onClick={retry}
            >
              <RefreshCw size={15} />
              Try Again
            </button>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && products.length === 0 && (
          <div
            className="glass-panel"
            style={{ padding: "3rem", textAlign: "center" }}
          >
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
              No products match your search. Try a different filter.
            </p>
          </div>
        )}

        {/* Product grid */}
        {!isLoading && !error && products.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
      {/* ── Pagination ── */}
      {!error && meta && meta.totalPages > 1 && (
        <div style={{ marginTop: "2.5rem" }}>
          <Pagination
            currentPage={page}
            totalPages={meta.totalPages}
            onPageChange={setPage}
            isDisabled={isLoading}
          />
          <p
            style={{
              textAlign: "center",
              marginTop: "1rem",
              color: "var(--text-muted)",
              fontSize: "0.8rem",
            }}
          >
            Page {page} of {meta.totalPages}
          </p>
        </div>
      )}
    </div>
  );
}

export default App;
