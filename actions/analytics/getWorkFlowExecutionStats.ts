"use server";

import { periodToDateRange } from "@/lib/helper/dates";
import { Period } from "@/types/analytics";
import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { eachDayOfInterval, format } from "date-fns";
import { WorkflowExecutionStatus } from "@/types/workflow";

type Stats = Record<string, { success: number; failed: number }>;

const dateFormat = "yyyy-MM-dd";

export async function getWorkflowExecutionStats(period: Period) {
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
        },
    });

    const stats: Stats = eachDayOfInterval({
        start: dateRange.startDate,
        end: dateRange.endDate,
    })
        .map((date) => format(date, dateFormat))
        .reduce((acc, date) => {
            acc[date] = {
                success: 0,
                failed: 0,
            };
            return acc;
        }, {} as any);

    executions.forEach((execution) => {
        const date = format(execution.startedAt!, dateFormat);
        if (execution.status === WorkflowExecutionStatus.COMPLETED) {
            stats[date].success += 1;
        }
        if (execution.status === WorkflowExecutionStatus.FAILED) {
            stats[date].failed += 1;
        }
    });

    const result = Object.entries(stats).map(([date, { success, failed }]) => ({
        date,
        success,
        failed,
    }));

    return result;
}
