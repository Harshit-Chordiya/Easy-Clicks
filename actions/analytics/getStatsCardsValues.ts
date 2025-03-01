"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { WorkflowExecutionStatus } from "@/types/workflow";

const { COMPLETED, FAILED } = WorkflowExecutionStatus;

export async function getStatsCardsValues(period: Period) {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    const dateRange = periodToDateRange(period);

    const executions = await prisma.workflowExecution.findMany({
        where: {
            userId,
            startedAt: {
                gte: dateRange.startDate,
                lte: dateRange.endDate,
            },
            status: {
                in: [COMPLETED, FAILED],
            },
        },
        select: {
            creditsConsumed: true,
            phases: {
                where: {
                    creditsConsumed: {
                        not: null,
                    },
                },
                select: {
                    creditsConsumed: true,
                },
            },
        },
    });

    const stats = {
        workflowExecutions: executions.length,
        creditsConsumed: executions.reduce(
            (acc, execution) => acc + execution.creditsConsumed,
            0,
        ),
        phaseExecutions: executions.reduce(
            (acc, execution) => acc + execution.phases.length,
            0,
        ),
    };

    return stats;
}
