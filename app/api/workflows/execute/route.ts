import { timingSafeEqual } from "crypto";
import prisma from "@/lib/prisma";
import {
    ExecutionPhaseStatus,
    WorkflowExecutionPlan,
    WorkflowExecutionStatus,
    WorkflowExecutionTrigger,
} from "@/types/workflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { executeWorkflow } from "@/lib/workflow/executeWorkflow";
import parser from "cron-parser";

export const dynamic = "force-dynamic";

function isValidSecret(secret: string) {
    const CRON_SECRET_KEY = process.env.CRON_SECRET_KEY;
    if (!CRON_SECRET_KEY) return false;

    try {
        return timingSafeEqual(Buffer.from(CRON_SECRET_KEY), Buffer.from(secret));
    } catch (error) {
        return false;
    }
}

export async function GET(req: Request) {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const secret = authHeader.split(" ")[1];
    if (!isValidSecret(secret)) {
        return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const workflowId = searchParams.get("workflowId");
    if (!workflowId) {
        return Response.json(
            { error: "Workflow ID not provided" },
            { status: 400 },
        );
    }

    const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
    });

    if (!workflow) {
        return Response.json({ error: "Workflow not found" }, { status: 404 });
    }

    const executionPlan = JSON.parse(
        workflow.executionPlan!,
    ) as WorkflowExecutionPlan;

    if (!executionPlan) {
        return Response.json(
            { error: "Execution plan not found" },
            { status: 404 },
        );
    }

    try {
        const cron = parser.parseExpression(workflow.cron!, { utc: true });
        const nextRun = cron.next().toDate();

        const execution = await prisma.workflowExecution.create({
            data: {
                workflowId,
                userId: workflow.userId,
                definition: workflow.definition,
                status: WorkflowExecutionStatus.PENDING,
                startedAt: new Date(),
                trigger: WorkflowExecutionTrigger.CRON,
                phases: {
                    create: executionPlan.flatMap((phase) => {
                        return phase.nodes.flatMap((node) => {
                            return {
                                userId: workflow.userId,
                                status: ExecutionPhaseStatus.CREATED,
                                number: phase.phase,
                                node: JSON.stringify(node),
                                name: TaskRegistry[node.data.type].label,
                            };
                        });
                    }),
                },
            },
        });

        await executeWorkflow(execution.id, nextRun);

        return new Response(null, { status: 200 });
    } catch (error) {
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
