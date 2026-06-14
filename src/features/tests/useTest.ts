import { useCallback, useEffect, useState } from "react";
import type { Test } from "@/types";
import { testsService } from "./tests.service";

export function useTest(id: string | undefined) {
  const [data, setData] = useState<Test | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      setData(await testsService.getById(id));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
