"use client";

import { useMutation } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const data = useMutation(trpc.invoke.mutationOptions({
    onSuccess: () => {
      toast.success("Background Job Invoked");
    }
  }));

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button disabled={data.isPending} onClick={() => data.mutate({ value: value })}>
          <p>Invoke Background Job</p>
        </Button>
      </div>
    </>
  );
}
