"use client";

import { useQuery } from "@tanstack/react-query";
import { ChartArticleViews } from "../../components/chart";
import { StatCard } from "../../components/ui/stat-card";
import { fetchTotalArticle } from "../../services/dashboard/fetchTotalArticle";
import { fetchTotalPostInstagram } from "../../services/dashboard/fetchTotalPostInstagram";
import { fetchTotalUserInstagram } from "../../services/dashboard/fetchTotalUserInstagram";

export default function DashboardHomePage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ArticleStats />
        <UserInstagramStats />
        <PostInstagramStats />
      </div>
      <div className="mt-6">
        <ChartArticleViews />
      </div>
    </div>
  );
}

function ArticleStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["total-article"],
    queryFn: () => fetchTotalArticle(),
  });

  return (
    <StatCard title="Total Artikel Telah Dipublikasi" count={data?.data} />
  );
}

function UserInstagramStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["total-user-instagram"],
    queryFn: () => fetchTotalUserInstagram(),
  });

  return <StatCard title="Total User Instagram" count={data?.data} />;
}

function PostInstagramStats() {
  const { data, isLoading } = useQuery({
    queryKey: ["total-post-instagram"],
    queryFn: () => fetchTotalPostInstagram(),
  });

  return <StatCard title="Total Post Instagram" count={data?.data} />;
}