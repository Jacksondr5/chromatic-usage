"use client";

import { useRouter } from "next/navigation";
import { api } from "~/trpc/react";

export type DeleteButtonProps = {
  id: string;
};

export const DeleteButton = ({ id }: DeleteButtonProps) => {
  const router = useRouter();
  const deleteApp = api.chromaticApp.delete.useMutation({
    onSuccess: () => {
      router.refresh();
    },
  });
  return (
    <button
      className="text-sm"
      onClick={() => {
        deleteApp.mutate(id);
      }}
    >
      ❌
    </button>
  );
};
