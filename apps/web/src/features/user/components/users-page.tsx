"use client";

import { Button } from "@/components/ui/button";
import { useCan } from "@/features/auth/hooks/use-auth";
import { useUsers } from "../hooks/use-user";
import { UserSheet } from "./user-sheet";
import { UserTable } from "./user-table";
import { UsersSkeleton } from "./users-skeleton";

// The list is never empty (the admin looking at it is in it), so there is no empty state.
function UsersList() {
  const { data: users = [], isPending, isError, isRefetching, refetch } = useUsers();

  if (isPending) return <UsersSkeleton />;

  if (isError) {
    return (
      <div role="alert" className="flex flex-col items-start gap-3 rounded-md border p-4">
        <p className="text-sm">Could not load users. Check your connection and try again.</p>
        <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
          Try again
        </Button>
      </div>
    );
  }

  return (
    <section className="space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">Users</h2>
          <p className="text-xs text-muted-foreground">
            Who can log in and what they may do. Deactivate a user instead of deleting them.
          </p>
        </div>

        <UserSheet />
      </header>

      <UserTable data={users} />
    </section>
  );
}

// Someone below admin who opens /dashboard/users by hand gets a message, not a failed request.
export function UsersPage() {
  const isAdmin = useCan("admin");

  if (!isAdmin) {
    return (
      <div role="alert" className="rounded-md border p-4 text-sm">
        Only admins can manage users.
      </div>
    );
  }

  return <UsersList />;
}
