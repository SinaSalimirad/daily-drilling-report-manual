import type { UserRole } from "../type";

// Lowest to highest: every role can do everything the roles before it can.
// Same order as `roleRank` in apps/api/src/features/users/roles.ts.
const ROLE_ORDER: readonly UserRole[] = ["viewer", "reporter", "manager", "admin"];

/** True when `userRole` is `minimum` or a higher role. */
export const hasRole = (userRole: UserRole, minimum: UserRole) =>
  ROLE_ORDER.indexOf(userRole) >= ROLE_ORDER.indexOf(minimum);
