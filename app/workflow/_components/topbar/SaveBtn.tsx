"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { UpdateWorkflow } from "@/actions/workflows/updateWorkflow";
import { toast } from "sonner";

export default function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();


  const saveMutation = useMutation({
    mutationFn: UpdateWorkflow,
    onSuccess: () => {
      toast.success("Flow saved successfully", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "save-workflow" });
    },
  });


  return (
    <Button
    disabled={saveMutation.isPending}
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const workflowDefinition = JSON.stringify(toObject());
        toast.loading("Saving flow...", { id: "save-workflow" });
        saveMutation.mutate({
          id: workflowId, definition: workflowDefinition, 
        });
      }}
    >
      <CheckIcon size={16} className="stroke-purple-500" />
      Save
    </Button>
  );
}
