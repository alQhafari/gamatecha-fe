"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { CardDemo } from "../../../../../components/article-card";
import { SkeletonCard } from "../../../../../components/skeleton-card";
import { Dialog, DialogContent } from "../../../../../components/ui/dialog";
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

      {isError && <span>Error Occured</span>}

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
            onClick={() => {
              if (postInstagram.caption) {
                scrapeOne(postInstagram.id);
              } else {
                toast.error("Post Instagram tidak memiliki caption");
              }
            }}
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
