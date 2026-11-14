import api from "@/lib/axios";
import type { CreateUserInput, UpdateUserInput, User } from "../type";

// Admin only (the API answers 403 to anyone else). There is no delete: a user who should
// no longer log in is deactivated, so their name stays on what they wrote.
export const userApi = {
  list: async () => (await api.get<User[]>("/v1/users")).data,
  create: async (input: CreateUserInput) => (await api.post<User>("/v1/users", input)).data,
  edit: async (id: string, input: UpdateUserInput) =>
    (await api.patch<User>(`/v1/users/${id}`, input)).data,
};
