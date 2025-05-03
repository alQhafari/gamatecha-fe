"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardDemo } from "../../../../../components/article-card";
import { SkeletonCard } from "../../../../../components/skeleton-card";
import { Dialog, DialogContent } from "../../../../../components/ui/dialog";
import { Input } from "../../../../../components/ui/input";
import { Spinner } from "../../../../../components/ui/spinner";
import { request } from "../../../../../services/api";
import { fetchPostInstagram } from "../../../../../services/post-instagrams/fetchPostInstagram";
import { generateUrl } from "../../../../../services/url";
import { PostInstagram } from "../../../../../types/post-instagram";

export default function DetailRiwayatScraping() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const { id } = params;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-instagram", id],
    queryFn: () => fetchPostInstagram(parseInt(id, 10)),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: (id: number) => {
      return request(generateUrl(`post-instagram/${id}/convert-to-article`), {
        method: "GET",
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        router.push("/dashboard/articles");
      }, 2000);
    },
    onError: () => {
      toast("Gagal Scraping User", {
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    },
  });

  const scrapeOne = (id: number) => {
    mutate(id);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Detail Riwayat Scraping</h1>
      {data && (
        <h3 className="text-xl font-bold mb-4">@{data.data.username}</h3>
      )}
      {isLoading && <span>Loading...</span>}
      {isError && <span>Error Occured</span>}

      {/* Search bar */}
      <div className="w-full mb-6 flex justify-between">
        <div className="flex justify-between gap-4">
          <Input
            type="text"
            placeholder="Cari Postingan..."
            className="bg-white border-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          ></Input>
          <div className="bg-white flex rounded-md items-center">
            <Input
              type="text"
              placeholder="Filter"
              className="bg-transparent border-none"
            ></Input>
            <Filter color="text-muted-foreground" size={24} />
          </div>
        </div>
      </div>

      {/* List of articles */}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : null}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {data?.data?.length === 0 ? <span>No articles found</span> : null}
        {data?.data?.postInstagram.map((postInstagram: PostInstagram) => (
          <div
            key={postInstagram.id}
            onClick={() => scrapeOne(postInstagram.id)}
          >
            <CardDemo
              description={postInstagram.caption.slice(0, 100)}
              imageUrl={postInstagram.thumbnailUrl}
              author={{
                name: `${data.data?.username}`,
                avatar: data.data?.profilePic
                  ? data.data?.profilePic
                  : "https://i.pravatar.cc/300",
              }}
              hoverText="Convert"
            />
          </div>
        ))}
      </div>
      {isPending ? (
        <Dialog open={isPending}>
          <DialogContent className="flex gap-4 items-center">
            <Spinner size={"large"} />
            <span>Sedang Konversi Data</span>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
}
