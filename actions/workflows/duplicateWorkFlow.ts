"use server";

import {
    duplicateWorkflowSchema,
    duplicateWorkflowSchemaType,
} from "@/schema/workflow";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";

export async function duplicateWorkflow(form: duplicateWorkflowSchemaType) {
    const { success, data } = duplicateWorkflowSchema.safeParse(form);
    if (!success) throw new Error("Invalid form data");

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const workflow = await prisma.workflow.findUnique({
        where: {
            id: data.workflowId,
            userId,
        },
    });

    if (!workflow) throw new Error("Workflow not found");

    const result = await prisma.workflow.create({
        data: {
            userId,
            name: data.name,
            description: data.description,
            status: WorkflowStatus.DRAFT,
            definition: workflow.definition,
        },
    });

    if (!result) throw new Error("Failed to duplicate workflow");

    revalidatePath("/workflows");
}
