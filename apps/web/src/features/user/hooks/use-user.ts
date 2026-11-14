import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { authKeys } from "@/features/auth/hooks/use-auth";
import { apiErrorMessage } from "@/lib/api-error";
import { userApi } from "../api/user.api";
import type { UpdateUserInput } from "../type";

export const userKeys = {
  all: ["users"] as const,
  list: () => [...userKeys.all, "list"] as const,
};

export const useUsers = () => useQuery({ queryKey: userKeys.list(), queryFn: userApi.list });

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.create,
    onSuccess: () => {
      toast.success("User added");
      return queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
    onError: (error) =>
      toast.error(
        apiErrorMessage(error, "Could not add the user. Please try again.", {
          409: "A user with this email already exists.",
        }),
      ),
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateUserInput }) => userApi.edit(id, input),
    onSuccess: () => {
      toast.success("User updated");
      // The edited user may be the admin themselves: the sidebar shows their name from "me".
      return Promise.all([
        queryClient.invalidateQueries({ queryKey: userKeys.all }),
        queryClient.invalidateQueries({ queryKey: authKeys.me() }),
      ]);
    },
    onError: (error) =>
      toast.error(
        apiErrorMessage(error, "Could not save the user. Please try again.", {
          403: "You can't change your own role or status. Another admin has to do it.",
          409: "At least one active admin must remain.",
        }),
      ),
  });
}
