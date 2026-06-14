import { api, unwrap } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Test } from "@/types";
import type { TestFormInput } from "./tests.schema";

export const testsService = {
  list: (limit?: number) => {
    const params = new URLSearchParams();
    if (limit) params.append("limit", limit.toString());
    const query = params.toString() ? `?${params.toString()}` : "";
    return unwrap<Test[]>(api.get(`${endpoints.tests.list}${query}`));
  },
  getById: (id: string) => unwrap<Test>(api.get(endpoints.tests.byId(id))),
  create: (payload: TestFormInput & { status?: "draft" | "live" | null }) =>
    unwrap<Test>(api.post(endpoints.tests.create, payload)),
  update: (id: string, payload: Partial<Test>) =>
    unwrap<Test>(api.put(endpoints.tests.update(id), payload)),
  publish: (id: string, payload?: any) =>
    unwrap<Test>(api.put(endpoints.tests.update(id), { status: "live", ...payload })),
  schedule: (id: string, payload: any) =>
    unwrap<Test>(api.put(endpoints.tests.update(id), { status: "scheduled", ...payload })),
  delete: (id: string) => unwrap<void>(api.delete(endpoints.tests.byId(id))),
};
