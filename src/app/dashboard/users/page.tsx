"use client";

import { useQuery } from "@tanstack/react-query";
import { DataTable } from "../../../components/data-table";
import { fetchUsers } from "../../../services/users/fetchUsers";
import { columns } from "./column";

export default function Users() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">User</h1>
      {isLoading && <span>Loading...</span>}
      <DataTable columns={columns} data={data ? data.data : []} />
    </div>
  );
}
