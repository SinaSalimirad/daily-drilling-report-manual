import type { UserRole } from "@/features/auth/type";

// What each role may do is decided by the API; see docs/authentication.md.
export const ROLE_ITEMS: ReadonlyArray<{ value: UserRole; label: string }> = [
  { value: "viewer", label: "Viewer (read only)" },
  { value: "reporter", label: "Reporter (writes reports and inventories)" },
  { value: "manager", label: "Manager (edits and deletes everything)" },
  { value: "admin", label: "Admin (also manages users)" },
];

export type UserStatus = "active" | "inactive";

export const STATUS_ITEMS: ReadonlyArray<{ value: UserStatus; label: string }> = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Deactivated (can't log in)" },
];

// Same limits as the password rule in apps/api/src/features/users/users.schema.ts.
export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 128;

// Table sizing shared by UserTable and UsersSkeleton so the loading state and the
// loaded state occupy the same height, even when the last page has fewer rows.
export const USER_PAGE_SIZE = 10;
export const USER_ROW_CLASS = "h-12"; // 48px
export const USER_TABLE_MIN_HEIGHT = 40 + USER_PAGE_SIZE * 48; // header h-10 + rows
