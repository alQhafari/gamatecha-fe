import * as React from "react";

import { useMutation } from "@tanstack/react-query";
import { X } from "lucide-react";
import Image from "next/image";
import Dropzone from "shadcn-dropzone";
import { toast } from "sonner";
import { cn } from "../../lib/utils";
import { UploadFile } from "../../services/upload/uploadFile";
import { SkeletonCard } from "../skeleton-card";

const InputFile = React.forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input"> & { onChange?: (value: string) => void }
>(({ className, ...props }) => {
  const [previews, setPreviews] = React.useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: UploadFile,
    onSuccess: (data) => {
      if (props.onChange) {
        props.onChange(data?.data?.url);
      }

      setPreviews((prev) => [...prev, data?.data?.url]);
    },
    onError: () => {
      toast("Gagal Membuat Article", {
        duration: 2000,
        className: "text-red-500",
        icon: <X className="w-6 h-6" />,
      });
    },
  });

  const handleDrop = (acceptedFiles: File[]) => {
    acceptedFiles.forEach((file) => {
      mutate(file);
    });
  };

  return (
    <>
      <Dropzone
        containerClassName={cn(
          `border-dashed h-32 border-2 border-gray-300 rounded-md p-4`,
          className
        )}
        showFilesList={true}
        dropZoneClassName="border-none"
        onDrop={handleDrop}
      ></Dropzone>
      {isPending ? <SkeletonCard /> : null}
      <div className="mt-4">
        {previews.map((src, index) => (
          <div key={index} className="relative">
            <Image
              width={100}
              height={100}
              objectFit="cover"
              layout="responsive"
              src={src}
              alt={`Preview ${index + 1}`}
              className="h-full w-full object-cover rounded-md"
            />
          </div>
        ))}
      </div>
    </>
  );
});
InputFile.displayName = "InputFile";

export { InputFile };
