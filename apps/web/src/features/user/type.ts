import type { AuthUser, UserRole } from "@/features/auth/type";

// A row of GET /users: the same public user (no password hash) that /auth/me returns.
export type User = AuthUser;

// Body of POST /users. The API lower-cases the email.
export type CreateUserInput = {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
};

// Body of PATCH /users/:id: only the fields that are sent change. The email is fixed.
export type UpdateUserInput = {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
  password?: string;
};
