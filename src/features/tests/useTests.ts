import { useCallback, useEffect, useState } from "react";
import type { Test } from "@/types";
import { testsService } from "./tests.service";

export function useTests(limit?: number) {
  const [data, setData] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async (fetchLimit?: number) => {
    setLoading(true);
    setError(null);
    try {
      setData(await testsService.list(fetchLimit));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(limit);
  }, [load, limit]);

  return { data, loading, error, refetch: () => load(limit) };
}
