"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import {
    ExecutionPhaseStatus,
    WorkflowExecutionPlan,
    WorkflowExecutionStatus,
    WorkflowExecutionTrigger,
    WorkflowStatus,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { redirect } from "next/navigation";
import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";

export default async function runWorkflow(form: {
    workflowId: string;
    flowDefinition?: string;
}) {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const { workflowId, flowDefinition } = form;
    if (!workflowId) throw new Error("Workflow not found");

    const workflow = await prisma.workflow.findUnique({
        where: {
            userId,
            id: workflowId,
        },
    });

    if (!workflow) throw new Error("Workflow not found");

    let executionPlan: WorkflowExecutionPlan;
    let workflowDefinition = flowDefinition;
    if (workflow.status === WorkflowStatus.PUBLISHED) {
        if (!workflow.executionPlan) throw new Error("No execution plan found");

        executionPlan = JSON.parse(workflow.executionPlan);
        workflowDefinition = workflow.definition;
    } else {
        if (!flowDefinition) throw new Error("Flow definition not defined");

        const flow = JSON.parse(flowDefinition);
        const result = flowToExecutionPlan(flow.nodes, flow.edges);

        if (result.error) throw new Error("Flow definition is invalid");

        if (!result.executionPlan)
            throw new Error("Failed to generate execution plan");

        executionPlan = result.executionPlan;
    }

    const execution = await prisma.workflowExecution.create({
        data: {
            workflowId,
            userId,
            status: WorkflowExecutionStatus.PENDING,
            startedAt: new Date(),
            trigger: WorkflowExecutionTrigger.MANUAL,
            definition: workflowDefinition,
            phases: {
                create: executionPlan.flatMap((phase) =>
                    phase.nodes.flatMap((node) => {
                        return {
                            userId,
                            status: ExecutionPhaseStatus.CREATED,
                            number: phase.phase,
                            node: JSON.stringify(node),
                            name: TaskRegistry[node.data.type].label,
                        };
                    }),
                ),
            },
        },
        select: {
            id: true,
            phases: true,
        },
    });

    if (!execution) throw new Error("Failed to create workflow execution");

    executeWorkflow(execution.id); // run this in the background

    redirect(`/workflow/runs/${workflowId}/${execution.id}`);
}
