"use server";

import { auth } from "@clerk/nextjs/server";
import { WorkflowStatus } from "@/types/workflow";
import { calculateWorkflowCost } from "@/lib/workflow/helpers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { flowToExecutionPlan } from "@/lib/workflow/executionPlan";

export async function publishWorkflow({
  id,
  flowDefinition,
}: {
  id: string;
  flowDefinition: string;
}) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");

  if (workflow.status !== WorkflowStatus.DRAFT)
    throw new Error("Workflow is not draft");

  const flow = JSON.parse(flowDefinition);
  const result = flowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) throw new Error("Flow definition is invalid");

  if (!result.executionPlan)
    throw new Error("Failed to generate execution plan");

  const creditsCost = calculateWorkflowCost(flow.nodes);

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      definition: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      status: WorkflowStatus.PUBLISHED,
      creditsCost,
    },
  });

  revalidatePath(`/workflows/editor/${id}`);
}
