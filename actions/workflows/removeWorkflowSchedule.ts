"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/prisma/prisma";
import { revalidatePath } from "next/cache";

export async function removeWorkflowSchedule(id: string) {
  const { userId } = auth();
  if (!userId) throw new Error("User not authenticated");

  await prisma.workflow.update({
    where: {
      id,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath("/workflows");
}
