"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CardDemo } from "../../../../../components/article-card";
import { Dialog, DialogContent } from "../../../../../components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "../../../../../components/ui/form";
import { Input } from "../../../../../components/ui/input";
import { LoadingButton } from "../../../../../components/ui/loading-button";
import { Skeleton } from "../../../../../components/ui/skeleton";
import { Spinner } from "../../../../../components/ui/spinner";
import { userInstagramSchema } from "../../../../../schemas/userInstagram";
import { createUserInstagram } from "../../../../../services/user-instagrams/createUserInstagram";
import { scrapingUserInstagram } from "../../../../../services/user-instagrams/scrapingUserInstagram";
import { searchUserInstagram } from "../../../../../services/user-instagrams/searchUserInstagram";

export default function TambahRiwayatScraping() {
  const [selectedUsername, setSelectedUsername] = useState<string | null>(null);

  const router = useRouter();

  const form = useForm<z.infer<typeof userInstagramSchema>>({
    resolver: zodResolver(userInstagramSchema),
    defaultValues: {
      username: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createUserInstagram,
    onSuccess: () => {
      toast("Berhasil Scraping User", { duration: 2000 });
      router.push("/dashboard/riwayat-scraping");
    },
    onError: () => {
      toast("Gagal Scraping User", {
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    },
  });

  const username = form.watch("username");

  const { data, isFetching } = useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["user-instagram/search", { username }],
    queryFn: () => searchUserInstagram(username),
    enabled: !!username,
  });

  const { data: PostInstagram, isLoading: loadingPostInstagram } = useQuery({
    placeholderData: keepPreviousData,
    queryKey: ["scraping", { selectedUsername }],
    queryFn: () => scrapingUserInstagram(selectedUsername!),
    enabled: !!selectedUsername,
  });

  function onSubmit(values: z.infer<typeof userInstagramSchema>) {
    mutate(values);
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Tambah Riwayat Scraping</h1>

      <div className="py-4">
        <Form {...form}>
          <form
            className="flex flex-row w-full justify-between items-end gap-2"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem className="w-3/4">
                  <FormLabel>Username Instagram</FormLabel>
                  <FormControl>
                    <Input
                      className="bg-white border-none"
                      placeholder="@gamatecha"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            ></FormField>

            {PostInstagram ? (
              <LoadingButton
                className="w-1/4"
                variant={"secondary"}
                loading={isPending}
                type="submit"
              >
                Scrape
              </LoadingButton>
            ) : null}
          </form>
        </Form>

        {isFetching || loadingPostInstagram ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={idx}
                className="h-96 rounded-md overflow-hidden relative"
              >
                <Skeleton className="absolute inset-0 w-full h-full" />
              </div>
            ))}
          </div>
        ) : null}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mt-8">
          {data && !PostInstagram
            ? data.data.map((user, key) => (
                <div
                  key={key}
                  onClick={() => {
                    setSelectedUsername(user.username);
                    form.setValue("username", user.username);
                  }}
                >
                  <CardDemo
                    description={user.full_name}
                    imageUrl={user.profile_pic_url}
                    author={{
                      name: `${user.username}`,
                      avatar: user.profile_pic_url
                        ? user.profile_pic_url
                        : "https://i.pravatar.cc/300",
                    }}
                  />
                </div>
              ))
            : null}

          {PostInstagram?.data.map((post, key) => (
            <div key={key}>
              <CardDemo
                description={post.caption?.text.slice(0, 100) ?? ""}
                imageUrl={post.thumbnail_url}
                author={{
                  name: `${post.user.username}`,
                  avatar: post.user.profile_pic_url
                    ? post.user.profile_pic_url
                    : "https://i.pravatar.cc/300",
                }}
                hoverText="Scrape"
              />
            </div>
          ))}
        </div>

        {isPending ? (
          <Dialog open={isPending}>
            <DialogContent className="flex gap-4 items-center">
              <Spinner size={"large"} />
              <span>Sedang Scraping</span>
            </DialogContent>
          </Dialog>
        ) : null}
      </div>
    </div>
  );
}
