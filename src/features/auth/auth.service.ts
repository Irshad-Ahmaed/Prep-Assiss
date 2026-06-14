import { api, unwrap } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { User } from "@/types";
import type { LoginInput } from "./auth.schema";

export interface LoginResult {
  token: string;
  user: User;
}

export const authService = {
  login: (payload: LoginInput) =>
    unwrap<LoginResult>(api.post(endpoints.auth.login, payload)),
};
