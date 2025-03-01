"use client";

import runWorkflow from "@/actions/workflows/runWorkFlow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function RunBtn({ workflowId }: { workflowId: string }) {
  const mutation = useMutation({
    mutationFn: runWorkflow,
    onSuccess: () => {
      toast.success("Workflow executed", { id: "workflowId" });
    },
    onError: () => {
      toast.error("Failed to execute workflow", { id: "workflowId" });
    },
  });
  return (
    <Button
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
      disabled={mutation.isPending}
      onClick={() => {
        toast.loading("Scheduling run...", { id: "workflowId" });
        mutation.mutate({ workflowId });
      }}
    >
      <PlayIcon size={16} />
    </Button>
  );
}
