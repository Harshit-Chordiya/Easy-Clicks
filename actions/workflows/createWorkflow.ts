"use server";

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { redirect } from "next/navigation";
import CreateFlowNode from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
// create workflow server action 
export async function CreateWorkflow(form: createWorkflowSchemaType) {
    const { success, data } = createWorkflowSchema.safeParse(form);
  
    if (!success) {
      throw new Error("Invalid form data");
    }
  
    const { userId } = auth();
  
    if (!userId) {
      throw new Error("Unauthenticated");
    }
    const initialFlow:{
      nodes:AppNode[];
      edges:Edge[];
    }={
      nodes:[],
      edges:[],
    };
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));
  
    const result = await prisma.workflow.create({
      data: {
        userId,
        status:WorkflowStatus.DRAFT, 
        definition:JSON.stringify(initialFlow),
        ...data,
      },
    });
    if(!result){
        throw new Error("Failed to create workflow");
    }
    redirect(`/workflow/editor/${result.id}`);
  }
  
