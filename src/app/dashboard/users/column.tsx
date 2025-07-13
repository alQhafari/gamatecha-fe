"use client";

import { ColumnDef } from "@tanstack/react-table";
import { User } from "../../../types/user";

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "isAdmin",
    header: "Admin",
    cell: ({ row }) => {
      const isAdmin = row.getValue("isAdmin") as boolean;
      return (
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            isAdmin
              ? "bg-green-100 text-green-800"
              : "bg-gray-100 text-gray-800"
          }`}
        >
          {isAdmin ? "Yes" : "No"}
        </span>
      );
    },
  },
];
