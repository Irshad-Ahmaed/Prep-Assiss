import { useCallback, useEffect, useState } from "react";
import type { SubTopic } from "@/types";
import { taxonomyService } from "./taxonomy.service";

export function useSubTopics(topicIds: string[]) {
  const [data, setData] = useState<SubTopic[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // Stable key to avoid effect loop from array identity
  const key = topicIds.slice().sort().join(",");

  const load = useCallback(async () => {
    if (!topicIds.length) {
      setData([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      setData(await taxonomyService.getSubTopicsByTopics(topicIds));
    } catch (e) {
      setError(e as Error);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    load();
  }, [load]);

  return { data, loading, error, refetch: load };
}
