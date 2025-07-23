"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export default function Home() {

  const trpc = useTRPC();
  const data = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background Job Invoked");
    },
    onError: () => {
      toast.error("Failed to invoke background job");
    },
  }));

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <Button disabled={data.isPending} onClick={() => data.mutate({ text: "client" })}>
          <p>Invoke Background Job</p>
        </Button>
      </div>
    </>
  );
}
