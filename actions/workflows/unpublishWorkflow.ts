"use server";

import { auth } from "@clerk/nextjs/server";

import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function unpublishWorkflow(id: string) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  const workflow = await prisma.workflow.findUnique({
    where: {
      id,
      userId,
    },
  });

  if (!workflow) throw new Error("Workflow not found");

  if (workflow.status !== WorkflowStatus.PUBLISHED)
    throw new Error("Workflow is not published");

  await prisma.workflow.update({
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0,
    },
    where: {
      id,
      userId,
    },
  });

  revalidatePath(`/workflow/editor/${id}`);
}
