"use client";

import { AppSidebar } from "@/src/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/src/components/ui/breadcrumb";
import { Separator } from "@/src/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/ui/sidebar";
import { ChevronRight } from "lucide-react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { ThemeProvider } from "../../components/theme-provider";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const segments = pathname
    .split("/")
    .filter((segment) => segment)
    .map((segment, index, arr) => ({
      name: segment
        .replaceAll("%5B", "[") // Mengganti URL-encoded '[' dengan '['
        .replaceAll("%5D", "]") // Mengganti URL-encoded ']' dengan ']'
        .replace(/-/g, " ") // Mengganti '-' dengan spasi
        .replace(/\b\w/g, (char) => char.toUpperCase()), // Kapitalisasi huruf pertama setiap kata
      href: `/${arr.slice(0, index + 1).join("/")}`,
    }));

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="dark:bg-white/95 overflow-scroll">
          <header className="flex h-16 shrink-0 items-center gap-2">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1 dark:bg-black" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList className="dark:text-black">
                  <BreadcrumbItem className="hidden md:block ">
                    <BreadcrumbLink href="/dashboard">Gamatecha</BreadcrumbLink>
                  </BreadcrumbItem>

                  {segments.map((segment, index) => (
                    <div className="flex items-center gap-3" key={segment.name}>
                      <ChevronRight />
                      <BreadcrumbItem>
                        <BreadcrumbLink
                          href={segment.href}
                          className={`${
                            index === segments.length - 1
                              ? "text-gray-500 pointer-events-none"
                              : "hover:underline"
                          }`}
                        >
                          {segment.name.charAt(0).toUpperCase() +
                            segment.name.slice(1)}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    </div>
                  ))}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0 dark:text-black">
            {children}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </ThemeProvider>
  );
}
