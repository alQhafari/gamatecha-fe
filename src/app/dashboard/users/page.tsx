"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pen, Trash } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../../components/data-table";
import { Button } from "../../../components/ui/button";
import { UserModal } from "../../../components/user-modal";
import { createUser } from "../../../services/users/createUser";
import { deleteUser } from "../../../services/users/deleteUser";
import { fetchUsers } from "../../../services/users/fetchUsers";
import { updateUser } from "../../../services/users/updateUser";
import { User } from "../../../types/user";
import { columns } from "./column";

export default function Users() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["users", { search, page }],
    queryFn: async () => fetchUsers({ search, page }),
  });

  const createUserMutation = useMutation({
    mutationFn: createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil ditambahkan");
      setIsModalOpen(false);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Gagal menambahkan user");
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<User> }) =>
      updateUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil diupdate");
      setIsModalOpen(false);
      setSelectedUser(null);
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Gagal mengupdate user");
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("User berhasil dihapus");
    },
    onError: (error: Error) => {
      toast.error(error?.message || "Gagal menghapus user");
    },
  });

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (userId: number) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus user ini?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  const handleSubmitUser = async (userData: Partial<User>) => {
    if (selectedUser) {
      // Edit mode
      updateUserMutation.mutate({
        id: selectedUser.id,
        data: userData,
      });
    } else {
      // Create mode
      createUserMutation.mutate(userData as Parameters<typeof createUser>[0]);
    }
  };

  // Add action column to the existing columns
  const enhancedColumns = [
    ...columns,
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }: { row: { original: User } }) => {
        const user = row.original;
        return (
          <div className="flex gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => handleEditUser(user)}
            >
              <Pen className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => handleDeleteUser(user.id)}
              disabled={deleteUserMutation.isPending}
            >
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        );
      },
    },
  ];

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  return (
    <div className="">
      {/* <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User</h1>
        <Button onClick={handleCreateUser}>
          <Plus className="h-4 w-4 mr-2" />
          Tambah User
        </Button>
      </div> */}

      <DataTable
        columns={enhancedColumns}
        data={data ? data.data : []}
        currentPage={data?.meta.page || 1}
        totalPage={data?.meta.totalPage || 1}
        setPage={setPage}
        search={search}
        setSearch={setSearch}
        isLoading={isLoading}
        handleCreateUser={handleCreateUser}
      />

      <UserModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedUser(null);
        }}
        user={selectedUser}
        onSubmit={handleSubmitUser}
        isLoading={createUserMutation.isPending || updateUserMutation.isPending}
      />
    </div>
  );
}
