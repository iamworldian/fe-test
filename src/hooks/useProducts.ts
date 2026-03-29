import { useState, useEffect, useCallback, useRef } from "react";
import { api } from "../services/api";
import type { Product, PaginatedResponse } from "../types/product";

interface UseProductsOptions {
  page: number;
  limit: number;
  category: string;
  search: string;
}

interface UseProductsReturn {
  products: Product[];
  meta: Omit<PaginatedResponse<Product>, "data"> | null;
  isLoading: boolean;
  isRetrying: boolean;
  retryCount: number;
  error: string | null;
  retry: () => void;
}

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

export function useProducts({
  page,
  limit,
  category,
  search,
}: UseProductsOptions): UseProductsReturn {
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState<Omit<
    PaginatedResponse<Product>,
    "data"
  > | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const isMountedRef = useRef(true);

  const fetchWithRetry = useCallback(
    async (attempt: number = 0) => {
      if (!isMountedRef.current) return;

      if (attempt === 0) {
        setIsLoading(true);
        setIsRetrying(false);
      } else {
        setIsRetrying(true);
      }
      setError(null);
      setRetryCount(attempt);

      try {
        const response = await api.fetchProducts({
          page,
          limit,
          category: category || undefined,
          search: search || undefined,
        });
        if (!isMountedRef.current) return;
        const { data, ...restMeta } = response;
        setProducts(data);
        setMeta(restMeta);
        setError(null);
      } catch (err) {
        if (!isMountedRef.current) return;
        if (attempt < MAX_RETRIES) {
          setTimeout(() => {
            if (isMountedRef.current) fetchWithRetry(attempt + 1);
          }, RETRY_DELAY_MS);
          return;
        }

        setError(
          err instanceof Error ? err.message : "An unknown error occurred.",
        );
        setProducts([]);
        setMeta(null);
      } finally {
        if (isMountedRef.current) {
          setIsLoading(false);
          if (attempt === 0 || attempt >= MAX_RETRIES) {
            setIsRetrying(false);
          }
        }
      }
    },
    [page, limit, category, search],
  );

  useEffect(() => {
    isMountedRef.current = true;
    fetchWithRetry(0);
    return () => {
      isMountedRef.current = false;
    };
  }, [fetchWithRetry]);

  const retry = useCallback(() => fetchWithRetry(0), [fetchWithRetry]);

  return { products, meta, isLoading, isRetrying, retryCount, error, retry };
}
