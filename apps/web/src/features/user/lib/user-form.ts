import type { UserRole } from "@/features/auth/type";
import { PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH, type UserStatus } from "../constants";
import type { CreateUserInput, UpdateUserInput, User } from "../type";

// One shape for "Add user" and "Edit user". Add ignores `status` (a new user is active);
// Edit ignores `email` (it can't change) and treats a blank `password` as "keep the old one".
export type UserFormValues = {
  email: string;
  displayName: string;
  role: UserRole;
  status: UserStatus;
  password: string;
};

export const defaultValues: UserFormValues = {
  email: "",
  displayName: "",
  role: "viewer",
  status: "active",
  password: "",
};

type FieldErrors = Partial<Record<keyof UserFormValues, string>>;

// Deliberately loose: the API (zod `z.email()`) is the real check, this only catches typos.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const isBlank = (value: string) => value.trim() === "";

// The password is checked exactly as typed (no trim), like the API does.
function passwordError(password: string) {
  if (password.length < PASSWORD_MIN_LENGTH) {
    return `Must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    return `Must be at most ${PASSWORD_MAX_LENGTH} characters`;
  }
  return undefined;
}

const toResult = (fields: FieldErrors) => (Object.keys(fields).length > 0 ? { fields } : undefined);

/**
 * Form-level validation for instant feedback; returns per-field messages for TanStack Form.
 * The API validates the same rules again, so this is UX only, never the source of truth.
 */
export function validateCreate({ value }: { value: UserFormValues }) {
  const fields: FieldErrors = {};

  if (isBlank(value.email)) fields.email = "Email is required";
  else if (!EMAIL_PATTERN.test(value.email.trim())) fields.email = "Enter a valid email address";

  if (isBlank(value.displayName)) fields.displayName = "Name is required";

  const password = value.password === "" ? "Password is required" : passwordError(value.password);
  if (password) fields.password = password;

  return toResult(fields);
}

/** Like `validateCreate`, without the email, and the password may stay blank. */
export function validateEdit({ value }: { value: UserFormValues }) {
  const fields: FieldErrors = {};

  if (isBlank(value.displayName)) fields.displayName = "Name is required";

  const password = value.password === "" ? undefined : passwordError(value.password);
  if (password) fields.password = password;

  return toResult(fields);
}

export const toCreatePayload = (values: UserFormValues): CreateUserInput => ({
  email: values.email.trim(),
  password: values.password,
  displayName: values.displayName.trim(),
  role: values.role,
});

/** Fills the edit form from an existing user; the password always starts blank. */
export const toFormValues = (user: User): UserFormValues => ({
  email: user.email,
  displayName: user.displayName,
  role: user.role,
  status: user.isActive ? "active" : "inactive",
  password: "",
});

/**
 * Only the fields that differ from `user` are sent. That is not just less data: the API
 * answers 403 when an admin sends `role` or `isActive` for their own account, even unchanged,
 * so sending everything would block an admin from renaming themselves.
 */
export function toUpdatePayload(values: UserFormValues, user: User): UpdateUserInput {
  const payload: UpdateUserInput = {};
  const displayName = values.displayName.trim();
  const isActive = values.status === "active";

  if (displayName !== user.displayName) payload.displayName = displayName;
  if (values.role !== user.role) payload.role = values.role;
  if (isActive !== user.isActive) payload.isActive = isActive;
  if (values.password !== "") payload.password = values.password;

  return payload;
}
