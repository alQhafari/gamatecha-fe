"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "../../../components/data-table";
import { fetchUsers } from "../../../services/users/fetchUsers";
import { columns } from "./column";

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users"],
    queryFn: async () => fetchUsers({ search, page }),
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">User</h1>
      {isLoading && <span>Loading...</span>}
      <DataTable
        columns={columns}
        data={data ? data.data : []}
        currentPage={data?.meta.page || 1}
        totalPage={data?.meta.totalPage || 1}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
      />
    </div>
  );
}
