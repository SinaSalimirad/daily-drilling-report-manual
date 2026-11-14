import { useForm } from "@tanstack/react-form";
import {
  defaultValues,
  type UserFormValues,
  type validateCreate,
  type validateEdit,
} from "../lib/user-form";

export type UserFormApi = ReturnType<typeof useUserForm>;

type Options = {
  /** `validateCreate` for "Add user", `validateEdit` for "Edit user". */
  validate: typeof validateCreate | typeof validateEdit;
  initialValues?: UserFormValues;
};

/**
 * `submit` returns true when the user was saved; only then the form is reset.
 * A failed submit keeps what was typed so it can be retried.
 */
export function useUserForm(
  submit: (values: UserFormValues) => Promise<boolean>,
  { validate, initialValues = defaultValues }: Options,
) {
  return useForm({
    defaultValues: initialValues,
    validators: { onChange: validate },
    onSubmit: async ({ value, formApi }) => {
      if (await submit(value)) formApi.reset();
    },
  });
}
