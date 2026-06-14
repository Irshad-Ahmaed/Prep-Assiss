import { useCallback, useEffect, useState } from "react";
import type { Topic } from "@/types";
import { taxonomyService } from "./taxonomy.service";

export function useTopics(subjectId: string | undefined | null) {
  const [data, setData] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const load = useCallback(async () => {
    if (!subjectId) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await taxonomyService.getTopicsBySubject(subjectId));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
  }, [subjectId]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
