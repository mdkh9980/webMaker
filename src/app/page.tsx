"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";

export default function Home() {
  const [value, setValue] = useState("");
  const trpc = useTRPC();
  const messages = useQuery(trpc.messages.getMany.queryOptions());
  const createMessage = useMutation(trpc.messages.create.mutationOptions({
    onSuccess: () => {
      toast.success("Message Created");
    }
  }));

  return (
    <>
      <div className="p-4 max-w-7xl mx-auto">
        <Input value={value} onChange={(e) => setValue(e.target.value)} />
        <Button disabled={createMessage.isPending} onClick={() => createMessage.mutate({ value: value })}>
          <p>Invoke Background Job</p>
        </Button>
        {JSON.stringify(messages)}
      </div>
    </>
  );
}
