"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { User } from "../types/user";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { LoadingButton } from "./ui/loading-button";

const userSchema = z.object({
  username: z.string().min(1, "Username is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().optional(),
  isAdmin: z.boolean().default(false),
});

// Create separate schemas for create and edit
const createUserSchema = userSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const editUserSchema = userSchema.extend({
  password: z
    .string()
    .optional()
    .refine((val) => {
      if (val === undefined || val === "") return true;
      return val.length >= 6;
    }, "Password must be at least 6 characters"),
});

type UserFormData = z.infer<typeof userSchema>;

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  onSubmit: (data: UserFormData) => Promise<void>;
  isLoading?: boolean;
}

export function UserModal({
  isOpen,
  onClose,
  user,
  onSubmit,
  isLoading = false,
}: UserModalProps) {
  const isEdit = !!user;

  const form = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      password: "",
      isAdmin: user?.isAdmin || false,
    },
  });

  // Reset form when user changes
  useEffect(() => {
    if (user) {
      form.reset({
        username: user.username,
        email: user.email,
        password: "",
        isAdmin: user.isAdmin,
      });
    } else {
      form.reset({
        username: "",
        email: "",
        password: "",
        isAdmin: false,
      });
    }
  }, [user, form]);

  const handleSubmit = async (data: UserFormData) => {
    try {
      await onSubmit(data);
      form.reset();
      onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  const handleClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit User" : "Tambah User Baru"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="Masukkan username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Masukkan email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Password {isEdit && "(Kosongkan jika tidak ingin mengubah)"}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Masukkan password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isAdmin"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Admin User</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Berikan akses admin kepada user ini
                    </p>
                  </div>
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Batal
              </Button>
              <LoadingButton
                type="submit"
                loading={isLoading}
                disabled={isLoading}
              >
                {isEdit ? "Update" : "Tambah"}
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
