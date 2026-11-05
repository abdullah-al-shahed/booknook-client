"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";


export function ReturnToast() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("returned") === "1") {
      toast.success("Book returned successfully.");
      router.replace("/my-borrows");
    }
  }, [searchParams, router]);

  return null;
}
