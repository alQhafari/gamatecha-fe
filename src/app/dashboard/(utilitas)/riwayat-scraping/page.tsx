"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "../../../../components/data-table";
import { fetchUserInstagram } from "../../../../services/user-instagrams/fetchUserInstagram";
import { columns } from "./column";

export default function DashboardArticles() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user-instagram", { search, page }],
    queryFn: async () => fetchUserInstagram({ search, page }),
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Riwayat Scraping</h1>
      <DataTable
        columns={columns}
        data={data ? data.data : []}
        currentPage={data?.meta.page || 1}
        totalPage={data?.meta.totalPage || 1}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
