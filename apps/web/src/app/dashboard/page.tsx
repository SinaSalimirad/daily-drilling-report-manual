"use client";

import Link from "next/link";
import { useMe } from "@/features/auth/hooks/use-auth";
import { navGroupsFor } from "@/shared/lib/navigation";

// Home of the dashboard: a way into every page the user may open. Real content (latest
// reports, totals) is on the roadmap.
export default function DashboardPage() {
  const { data: user } = useMe();

  // The dashboard layout (AuthGuard) only renders pages once the user is loaded.
  if (!user) return null;

  const pages = navGroupsFor(user.role).flatMap((group) => group.items);

  return (
    <section className="space-y-4">
      <header className="space-y-1">
        <h2 className="text-lg font-semibold tracking-tight">Welcome, {user.displayName}</h2>
        <p className="text-xs text-muted-foreground">Choose where you want to work.</p>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {pages.map((page) => (
          <li key={page.url}>
            <Link
              href={page.url}
              className="flex h-full flex-col gap-1 rounded-md border p-4 transition-colors hover:bg-muted"
            >
              <span className="text-sm font-medium">{page.title}</span>
              <span className="text-xs text-muted-foreground">{page.description}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
