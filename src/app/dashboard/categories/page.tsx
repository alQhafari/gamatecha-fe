"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataTable } from "../../../components/data-table";
import { fetchCategories } from "../../../services/categories/fetchCategories";
import { columns } from "./column";

export default function Categories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["categories", { search, page }],
    queryFn: () =>
      fetchCategories({
        search,
        page,
      }),
  });

  if (isError) {
    return <span>Error: {error.message}</span>;
  }
  return (
    <div className="">
      <h1 className="text-2xl font-bold mb-4">Kategori</h1>
      <DataTable
        search={search}
        columns={columns}
        data={data ? data.data : []}
        currentPage={data?.meta.page || 1}
        totalPage={data?.meta.totalPage || 1}
        setPage={setPage}
        setSearch={setSearch}
        isLoading={isLoading}
      />
    </div>
  );
}
