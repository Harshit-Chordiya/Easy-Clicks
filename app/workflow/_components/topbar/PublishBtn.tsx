"use client";

import { publishWorkflow } from "@/actions/workflows/publishWorkflow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function PublishBtn({ workflowId }: { workflowId: string }) {
    const generate = useExecutionPlan();
    const { toObject } = useReactFlow();

    const mutation = useMutation({
        mutationFn: publishWorkflow,
        onSuccess: () => {
            toast.success("Workflow published", { id: "workflowId" });
        },
        onError: () => {
            toast.error("Failed to publish workflow", { id: "workflowId" });
        },
    });

    return (
        <Button
            variant="outline"
            className="flex items-center gap-2"
            disabled={mutation.isPending}
            onClick={() => {
                const plan = generate();
                if (!plan) return;
                toast.loading("Publishing workflow...", { id: "workflowId" });
                mutation.mutate({
                    id: workflowId,
                    flowDefinition: JSON.stringify(toObject()),
                });
            }}
        >
            <UploadIcon size={16} className="stroke-green-400" />
            Publish
        </Button>
    );
}
