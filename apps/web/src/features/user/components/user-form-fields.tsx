import { FieldDescription, FieldGroup, FieldLegend, FieldSet } from "@/components/ui/field";
import { Separator } from "@/components/ui/separator";
import { SelectField, TextField } from "@/shared/components/form-fields";
import { PASSWORD_MIN_LENGTH, ROLE_ITEMS, STATUS_ITEMS } from "../constants";
import type { UserFormApi } from "../hooks/use-user-form";

const sectionGridClass = "grid grid-cols-1 gap-5 sm:grid-cols-2";

type Props = {
  form: UserFormApi;
  mode: "create" | "edit";
  /** Editing your own account: the API refuses a change of your own role or status. */
  isSelf?: boolean;
};

export function UserFormFields({ form, mode, isSelf = false }: Props) {
  const isEdit = mode === "edit";

  return (
    <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1fr_auto_1fr]">
      <FieldSet className="min-w-0">
        <FieldLegend>Account</FieldLegend>
        <FieldGroup className={sectionGridClass}>
          <form.Field name="displayName">
            {(field) => (
              <TextField field={field} required label="Name" placeholder="e.g. Sara Ahmadi" />
            )}
          </form.Field>
          <form.Field name="email">
            {(field) => (
              <TextField
                field={field}
                required={!isEdit}
                // The email is the login name and can't change after the account is created.
                disabled={isEdit}
                label="Email"
                placeholder="name@company.com"
                type="email"
              />
            )}
          </form.Field>
          <div className="sm:col-span-2">
            <form.Field name="password">
              {(field) => (
                <TextField
                  field={field}
                  required={!isEdit}
                  label={isEdit ? "New password" : "Password"}
                  placeholder={`At least ${PASSWORD_MIN_LENGTH} characters`}
                  type="password"
                  autoComplete="new-password"
                  description={
                    isEdit
                      ? "Leave blank to keep the current password. A new one logs the user out everywhere."
                      : "Give it to the user yourself; no email is sent."
                  }
                />
              )}
            </form.Field>
          </div>
        </FieldGroup>
      </FieldSet>

      {/* Horizontal when the sections are stacked, vertical when they sit side by side. */}
      <Separator className="xl:hidden" />
      <Separator orientation="vertical" className="hidden xl:block" />

      <FieldSet className="min-w-0">
        <FieldLegend>Access</FieldLegend>
        {isSelf && (
          <FieldDescription>
            This is your own account. Another admin has to change your role or status.
          </FieldDescription>
        )}
        <FieldGroup className={sectionGridClass}>
          <form.Field name="role">
            {(field) => (
              <SelectField
                field={field}
                required
                disabled={isSelf}
                label="Role"
                placeholder="Select role"
                items={ROLE_ITEMS}
              />
            )}
          </form.Field>
          {isEdit && (
            <form.Field name="status">
              {(field) => (
                <SelectField
                  field={field}
                  required
                  disabled={isSelf}
                  label="Status"
                  placeholder="Select status"
                  items={STATUS_ITEMS}
                />
              )}
            </form.Field>
          )}
        </FieldGroup>
      </FieldSet>
    </div>
  );
}
