import { auth } from "@clerk/nextjs/server";
import React from "react";
import prisma from "@/lib/prisma";
import { waitFor } from "@/lib/helper/waitFor";
import Editor from "@/app/workflow/_components/Editor"
async function page({ params }: { params: { workflowId: string } }) {
  const { workflowId } = params;
  const { userId } = auth();

  if (!userId) return <div>Unauthenticated</div>;

  
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) return <div>Workflow not found</div>;

  return <Editor workflow={workflow}/>;
}

export default page;
