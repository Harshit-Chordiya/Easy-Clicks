"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import getWorkflowPhaseDetails from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { getPhasesTotalCost } from "@/lib/phases";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { cn, datesToDurationString } from "@/lib/utils";
import {
    ExecutionPhaseStatus,
    WorkflowExecutionStatus,
} from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
    CalendarIcon,
    CircleDashedIcon,
    ClockIcon,
    CoinsIcon,
    Loader2Icon,
    LucideIcon,
    WorkflowIcon,
} from "lucide-react";
import React, { ReactNode, useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ExecutionLog } from "@prisma/client";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LogLevel } from "@/types/log";
import PhaseStatusBadge from "./PhaseStatusBadge";
import ReactCountUpWrapper from "@/components/react-count-up-wrapper";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

export default function ExecutionViewer({
    initialData,
}: {
    initialData: ExecutionData;
}) {
    const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        queryFn: () => GetWorkflowExecutionWithPhases(initialData?.id || ""),
        refetchInterval: (query) =>
            query.state.data?.status === WorkflowExecutionStatus.RUNNING
                ? 1000
                : false,
        initialData,
    });

    const phaseDetails = useQuery({
        queryKey: ["phaseDetails", selectedPhase, query.data?.status],
        enabled: selectedPhase !== null,
        queryFn: () => getWorkflowPhaseDetails(selectedPhase || ""),
    });

    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    useEffect(() => {
        // while running, auto-select the current running phase in the sidebar
        const phases = query.data?.phases || [];
        if (isRunning) {
            // select the last executed phase
            const phaseToSelect = phases.toSorted((a, b) =>
                a.startedAt! > b.startedAt! ? -1 : 1,
            )[0];
            setSelectedPhase(phaseToSelect.id);
            return;
        }
        const phaseToSelect = phases.toSorted((a, b) =>
            a.completedAt! > b.completedAt! ? -1 : 1,
        )[0];
        setSelectedPhase(phaseToSelect.id);
    }, [isRunning, query.data?.phases, setSelectedPhase]);

    const duration = datesToDurationString(
        query.data?.completedAt,
        query.data?.startedAt,
    );

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

    return (
        <div className="flex h-full w-full">
            <aside className="flex w-[400px] min-w-[400px] max-w-[400px] flex-grow border-separate flex-col overflow-hidden border-r-2">
                <div className="px-2 py-4">
                    <ExecutionLabel
                        icon={CircleDashedIcon}
                        label="Status"
                        value={
                            <div className="flex items-center gap-2 font-semibold capitalize">
                                <PhaseStatusBadge
                                    status={query.data?.status as ExecutionPhaseStatus}
                                />
                                <span>{query.data?.status}</span>
                            </div>
                        }
                    />
                    <ExecutionLabel
                        icon={CalendarIcon}
                        label="Started at"
                        value={
                            <span className="lowercase">
                                {query.data?.startedAt
                                    ? formatDistanceToNow(new Date(query.data?.startedAt), {
                                        addSuffix: true,
                                    })
                                    : "-"}
                            </span>
                        }
                    />
                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Duration"
                        value={
                            duration ? (
                                duration
                            ) : (
                                <Loader2Icon size={20} className="animate-spin" />
                            )
                        }
                    />
                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits consumed"
                        value={<ReactCountUpWrapper value={creditsConsumed} />}
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-center px-4 py-2">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">Phases</span>
                    </div>
                </div>
                <Separator />
                <div className="h-full overflow-auto px-2 py-4">
                    {query.data?.phases.map((phase, index) => (
                        <Button
                            key={phase.id}
                            variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                            className="w-full justify-between"
                            onClick={() => {
                                if (isRunning) return;
                                setSelectedPhase(phase.id);
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <Badge variant="outline">{index + 1}</Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <PhaseStatusBadge status={phase.status as ExecutionPhaseStatus} />
                        </Button>
                    ))}
                </div>
            </aside>
            <div className="flex h-full w-full">
                {isRunning && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <p className="font-bold">Run is in progress, please wait</p>
                    </div>
                )}
                {!isRunning && !selectedPhase && (
                    <div className="flex h-full w-full flex-col items-center justify-center gap-2">
                        <div className="flex flex-col gap-1 text-center">
                            <p className="font-bold">No phase selected</p>
                            <p className="text-sm text-muted-foreground">
                                Select a phase to view details
                            </p>
                        </div>
                    </div>
                )}
                {!isRunning && selectedPhase && phaseDetails.data && (
                    <div className="container flex flex-col gap-4 overflow-auto py-4">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="space-x-4">
                                <div className="flex items-center gap-2">
                                    <CoinsIcon size={18} className="stroke-muted-foreground" />
                                    <span>Credits</span>
                                </div>
                                <span>{phaseDetails.data.creditsConsumed}</span>
                            </Badge>
                            <Badge variant="outline" className="space-x-4">
                                <div className="flex items-center gap-2">
                                    <ClockIcon size={18} className="stroke-muted-foreground" />
                                    <span>Duration</span>
                                </div>
                                <span>
                                    {datesToDurationString(
                                        phaseDetails.data.completedAt,
                                        phaseDetails.data.startedAt,
                                    ) || "-"}
                                </span>
                            </Badge>
                        </div>

                        <ParameterViewer
                            title="Inputs"
                            subtitle="Inputs used for this phase"
                            paramsJson={phaseDetails.data.inputs}
                        />
                        <ParameterViewer
                            title="Outputs"
                            subtitle="Outputs generated by this phase"
                            paramsJson={phaseDetails.data.outputs}
                        />

                        <LogViewer logs={phaseDetails.data.executionLogs} />
                    </div>
                )}
            </div>
        </div>
    );
}

function ExecutionLabel({
    icon,
    label,
    value,
}: {
    icon: LucideIcon;
    label: ReactNode;
    value: ReactNode;
}) {
    const Icon = icon;
    return (
        <div className="flex items-center justify-between px-4 py-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon size={20} className="stroke-muted-foreground/80" />
                <span>{label}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold capitalize">
                {value}
            </div>
        </div>
    );
}

function ParameterViewer({
    title,
    subtitle,
    paramsJson,
}: {
    title: string;
    subtitle: string;
    paramsJson: string | null;
}) {
    const params = paramsJson ? JSON.parse(paramsJson) : undefined;

    return (
        <Card>
            <CardHeader className="rounded-lg rounded-b-none border-b bg-gray-50 py-4 dark:bg-background">
                <CardTitle className="text-base">{title}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    {subtitle}
                </CardDescription>
            </CardHeader>
            <CardContent className="py-4">
                <div className="flex flex-col gap-2">
                    {(!params || Object.keys(params).length === 0) && (
                        <p className="text-sm">No parameters generated by this phase</p>
                    )}
                    {params &&
                        Object.entries(params).map(([key, value]) => (
                            <div key={key} className="flex items-center justify-between">
                                <p className="flex-1 basis-1/3 text-sm text-muted-foreground">
                                    {key}
                                </p>
                                <Input
                                    readOnly
                                    className="flex-1 basis-2/3"
                                    value={value as string}
                                />
                            </div>
                        ))}
                </div>
            </CardContent>
        </Card>
    );
}

function LogViewer({ logs }: { logs: ExecutionLog[] | undefined }) {
    if (!logs || logs.length === 0) return null;
    return (
        <Card className="w-full">
            <CardHeader className="rounded-lg rounded-b-none border-b bg-gray-50 py-4 dark:bg-background">
                <CardTitle className="text-base">Logs</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                    Logs generated by this phase
                </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                <Table>
                    <TableHeader className="text-sm text-muted-foreground">
                        <TableRow>
                            <TableHead>Time</TableHead>
                            <TableHead>Level</TableHead>
                            <TableHead>Message</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {logs.map((log) => (
                            <TableRow key={log.id} className="text-muted-foreground">
                                <TableCell
                                    width={190}
                                    className="p-[2px] pl-4 text-xs text-muted-foreground"
                                >
                                    {log.timestamp.toISOString()}
                                </TableCell>
                                <TableCell
                                    width={80}
                                    className={cn(
                                        "text-sx p-[3px] pl-4 font-bold uppercase",
                                        (log.logLevel as LogLevel) === "error" &&
                                        "text-destructive",
                                        (log.logLevel as LogLevel) === "info" && "text-primary",
                                        (log.logLevel as LogLevel) === "warning" &&
                                        "text-yellow-500",
                                    )}
                                >
                                    {log.logLevel}
                                </TableCell>
                                <TableCell className="flex-1 p-[3px] pl-4 text-sm">
                                    {log.message}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
