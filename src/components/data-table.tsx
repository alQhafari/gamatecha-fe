"use client";

import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Skeleton } from "@/src/components/ui/skeleton";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  currentPage: number;
  totalPage: number;
  setPage: (page: number) => void;
  setSearch: (search: string) => void;
  search: string;
  isLoading?: boolean;
  handleCreateUser?: () => void;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading,
  currentPage,
  totalPage,
  setPage,
  search,
  setSearch,
  handleCreateUser,
}: DataTableProps<TData, TValue>) {
  const router = useRouter();

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters,
    },
  });

  return (
    <div className="rounded-md bg-white p-4">
      <div className="flex items-center justify-between py-4">
        <Input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm bg-white border border-gray-200"
        />
        <Button
          onClick={
            handleCreateUser
              ? handleCreateUser
              : () => {
                  const currentPath = window.location.pathname;
                  router.push(`${currentPath}/tambah`);
                }
          }
          variant="secondary"
        >
          <Plus size={24} />
          Tambah
        </Button>
      </div>
      <div className="rounded-md border border-gray-200">
        <Table>
          <TableHeader className="border-none">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                className="border-gray-200 hover:bg-gray-100 font-bold"
                key={headerGroup.id}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead className="font-bold text-black" key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="border-gray-200">
            {isLoading && (
              <TableRow>
                <TableCell colSpan={columns.length}>
                  <Skeleton className="h-24" />
                </TableCell>
              </TableRow>
            )}
            {table.getRowModel().rows?.length && isLoading === false ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  className="border-gray-200 hover:bg-gray-100"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : isLoading ? null : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Tidak ada data yang ditemukan
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <Button
          variant={"secondary"}
          size="sm"
          onClick={() => {
            if (currentPage > 1) {
              setPage(currentPage - 1);
            } else {
              return;
            }
          }}
          disabled={currentPage <= 1}
        >
          Previous
        </Button>
        <Button
          variant={"secondary"}
          size="sm"
          onClick={() => {
            console.log(currentPage, totalPage);

            if (currentPage < totalPage) {
              setPage(currentPage + 1);
            } else {
              return;
            }
          }}
          disabled={currentPage >= totalPage}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
