"use client";

import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useMe } from "../hooks/use-auth";

// Renders the dashboard only once the logged-in user is known, so no page (and no `useCan`)
// runs without a user. The API is still the gate: this only decides what the browser shows.
export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { isPending, isError, error, isRefetching, refetch } = useMe();

  // lib/axios.ts already tried to refresh the session before this 401 reached us.
  const sessionEnded = isAxiosError(error) && error.response?.status === 401;

  useEffect(() => {
    if (sessionEnded) router.replace("/login");
  }, [sessionEnded, router]);

  if (isPending || sessionEnded) {
    return (
      <div className="flex min-h-svh items-center justify-center" aria-busy="true">
        <Loader2 className="size-6 animate-spin text-muted-foreground" />
        <span className="sr-only">Loading your account</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-svh items-center justify-center p-4">
        <div role="alert" className="flex flex-col items-start gap-3 rounded-md border p-4">
          <p className="text-sm">
            Could not load your account. Check your connection and try again.
          </p>
          <Button variant="outline" onClick={() => refetch()} disabled={isRefetching}>
            Try again
          </Button>
        </div>
      </div>
    );
  }

  return children;
}
