"use client";

import { createColumnHelper } from "@tanstack/react-table";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import type { DataTableFeatures } from "@/lib/table-feature";
import type { User } from "../type";
import { UserEditSheet } from "./user-edit-sheet";

const columnHelper = createColumnHelper<DataTableFeatures, User>();

const centeredHeader = (title: string) => () => <div className="text-center">{title}</div>;

// A component (not inline in the column) so it can hold the edit sheet state. Editing is the
// only action: users are deactivated, never deleted.
function UserActions({ user }: { user: User }) {
  const [editOpen, setEditOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Button variant="ghost" size="icon" className="size-8" onClick={() => setEditOpen(true)}>
        <span className="sr-only">Edit {user.displayName}</span>
        <Pencil className="size-4" />
      </Button>

      <UserEditSheet user={user} open={editOpen} onOpenChange={setEditOpen} />
    </div>
  );
}

export const userColumns = columnHelper.columns([
  columnHelper.display({
    id: "counter",
    header: () => <div className="text-center">#</div>,
    cell: ({ row }) => (
      <div className="text-center text-muted-foreground tabular-nums">{row.index + 1}</div>
    ),
  }),
  columnHelper.accessor("displayName", {
    header: () => <div className="text-left">Name</div>,
    cell: ({ getValue }) => <span className="font-medium text-left">{getValue()}</span>,
    filterFn: "includesString", // case-insensitive search from the toolbar
    sortFn: "alphanumeric",
  }),
  columnHelper.accessor("email", {
    header: () => <div className="text-left">Email</div>,
    cell: ({ getValue }) => <span className="text-left">{getValue()}</span>,
  }),
  columnHelper.accessor("role", {
    header: centeredHeader("Role"),
    cell: ({ getValue }) => <div className="text-center capitalize">{getValue()}</div>,
  }),
  columnHelper.accessor("isActive", {
    header: centeredHeader("Status"),
    cell: ({ getValue }) =>
      getValue() ? (
        <div className="text-center">Active</div>
      ) : (
        <div className="text-center text-muted-foreground">Deactivated</div>
      ),
  }),
  columnHelper.display({
    id: "actions",
    header: centeredHeader("Edit"),
    cell: ({ row }) => <UserActions user={row.original} />,
  }),
]);
