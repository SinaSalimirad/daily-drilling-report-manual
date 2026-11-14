"use client";

import { Plus } from "lucide-react";
import { useState } from "react";
import { useCreateUser } from "../hooks/use-user";
import { useUserForm } from "../hooks/use-user-form";
import { toCreatePayload, validateCreate } from "../lib/user-form";
import { UserFormSheet } from "./user-form-sheet";

export function UserSheet() {
  const [open, setOpen] = useState(false);
  const { mutateAsync: createUser } = useCreateUser();

  const form = useUserForm(
    async (values) => {
      try {
        await createUser(toCreatePayload(values));
      } catch {
        // The hook shows the error as a toast; keep the sheet open so nothing typed is lost.
        return false;
      }

      setOpen(false);
      return true;
    },
    { validate: validateCreate },
  );

  return (
    <UserFormSheet
      form={form}
      mode="create"
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
      }}
      title="Add New User"
      submitLabel="Add User"
      submittingLabel="Adding..."
      trigger={
        <>
          <Plus className="size-4" />
          Add User
        </>
      }
    />
  );
}
