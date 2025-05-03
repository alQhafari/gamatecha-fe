"use client";

import Image from "next/image";
import { ArticleStatus } from "../app/enum/article-status.enum";
import { cn } from "../lib/utils";

interface CardDemoProps {
  className?: string;
  title?: string;
  slug?: string;
  description?: string;
  imageUrl?: string;
  author: {
    name: string;
    avatar: string;
  };
  status?: ArticleStatus;
  readTime?: string;
  hoverText?: string;
}

export function CardDemo({
  className,
  title,
  description,
  imageUrl,
  author,
  readTime,
  status,
  hoverText,
}: CardDemoProps) {
  return (
    <div className={cn("max-w-full w-full group/card", className)}>
      <div
        className={cn(
          "cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl max-w-full mx-auto flex flex-col justify-between p-4",
          `bg-cover`
        )}
      >
        <Image
          src={imageUrl!}
          alt={title!}
          fill
          className="object-cover"
          crossOrigin="anonymous"
        />

        {/* Overlay gradient di atas image */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-70" />

        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover/card:opacity-100 transition duration-300 flex items-center justify-center z-20">
          {hoverText ? (
            <button className="px-6 py-2 bg-white text-black font-semibold rounded-md shadow-md hover:bg-gray-200 transition">
              {hoverText}
            </button>
          ) : null}
        </div>

        <div className="flex flex-row w-full justify-between z-10">
          <div className="flex flex-row items-center space-x-4 ">
            <Image
              height="100"
              width="100"
              alt="Avatar"
              src={author.avatar}
              className="h-10 w-10 rounded-full border-2 object-cover"
            />
            <div className="flex flex-col">
              <p className="font-normal text-base text-gray-50 relative z-10">
                {author.name}
              </p>
              <p className="text-sm text-gray-400">{readTime}</p>
            </div>
          </div>
          {status ? (
            <div>
              <span
                className={`text-white ${
                  status === ArticleStatus.ARCHIVED
                    ? "bg-amber-500"
                    : "bg-green-500"
                } rounded-full px-2 py-1`}
              >
                {status}
              </span>
            </div>
          ) : null}
        </div>
        <div className="text content">
          <h1 className="font-bold text-xl md:text-2xl text-gray-50 relative z-10">
            {title}
          </h1>
          <p
            dangerouslySetInnerHTML={{ __html: description || "" }}
            className="font-normal text-sm text-gray-50 relative z-10 my-4"
          ></p>
        </div>
      </div>
    </div>
  );
}
