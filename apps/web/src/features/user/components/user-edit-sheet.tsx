"use client";

import { useEffect } from "react";
import { useMe } from "@/features/auth/hooks/use-auth";
import { useUpdateUser } from "../hooks/use-user";
import { useUserForm } from "../hooks/use-user-form";
import { toFormValues, toUpdatePayload, validateEdit } from "../lib/user-form";
import type { User } from "../type";
import { UserFormSheet } from "./user-form-sheet";

type Props = {
  user: User;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function UserEditSheet({ user, open, onOpenChange }: Props) {
  const { data: me } = useMe();
  const { mutateAsync: updateUser } = useUpdateUser();

  const form = useUserForm(
    async (values) => {
      const input = toUpdatePayload(values, user);

      // Nothing changed: no request, and no "User updated" toast for a save that did nothing.
      if (Object.keys(input).length > 0) {
        try {
          await updateUser({ id: user.id, input });
        } catch {
          // The hook shows the error as a toast; keep the sheet open so nothing typed is lost.
          return false;
        }
      }

      onOpenChange(false);
      return true;
    },
    { validate: validateEdit, initialValues: toFormValues(user) },
  );

  // Load the latest saved values every time the sheet opens (the user may have changed).
  useEffect(() => {
    if (open) form.reset(toFormValues(user));
  }, [open, user, form]);

  return (
    <UserFormSheet
      form={form}
      mode="edit"
      isSelf={me?.id === user.id}
      open={open}
      onOpenChange={onOpenChange}
      title={`Edit ${user.displayName}`}
      submitLabel="Save Changes"
      submittingLabel="Saving..."
    />
  );
}
