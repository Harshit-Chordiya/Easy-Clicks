import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DatesToDurationString } from "@/lib/helper/dates";
import { GetPhasesTotalCost } from "@/lib/helper/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { CircleDashedIcon, ClockIcon, CoinsIcon, Loader2Icon, LucideIcon, WorkflowIcon } from "lucide-react";
import React, { ReactNode, use } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

interface ExecutionViewerProps {
    initialData: ExecutionData;
}

export default function ExecutionViewer({ initialData }: ExecutionViewerProps) {
    const [selectedPhase, setSelectedPhase] = React.useState<string | null>(null);
    const query = useQuery({
        queryKey: ["execution", initialData?.id],
        queryFn: () => GetWorkflowExecutionWithPhases(initialData!.id),
        initialData,
        refetchInterval: (q) =>
            q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
    });

    const phaseDetails = useQuery({
        queryKey: ["phase", selectedPhase],
        enabled: selectedPhase !== null,
        queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
    });
    const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

    const duration = DatesToDurationString(
        query.data?.completedAt,
        query.data?.startedAt
    );

    const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);
    return (
        <div className="w-full h-full flex">
            <aside className="w-[440px]  min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col overflow-hidden">
                <div className=" py-2 px-2">

                    <ExecutionLabel icon={CircleDashedIcon} label="Status" value={query.data?.status} />

                    <ExecutionLabel icon={CircleDashedIcon} label="Started at" value={<span className="lowercase">{query.data?.startedAt ? formatDistanceToNow(new Date(query.data?.startedAt), {
                        addSuffix: true
                    }) : "_"} </span>} />

                    <ExecutionLabel
                        icon={ClockIcon}
                        label="Duration"
                        value={duration ? (duration) : (<Loader2Icon className="animate-spin" size={20} />
                        )}

                    />

                    <ExecutionLabel
                        icon={CoinsIcon}
                        label="Credits consumed"
                        value={creditsConsumed}
                    />
                </div>
                <Separator />
                <div className="flex justify-center items-center py-2 px-4">
                    <div className="text-muted-foreground flex items-center gap-2">
                        <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
                        <span className="font-semibold">Phases</span>
                    </div>
                </div>
                <Separator />
                <div className=" overflow-auto h-full px-2 py-4">
                    {query?.data?.phases?.map((phase, index) => (
                        <Button key={phase.id} className="justify-between w-full" variant={selectedPhase === phase.id ? "secondary" : "ghost"} onClick={() => { if (isRunning) return; setSelectedPhase(phase.id) }}>
                            <div className="flex items-center gap-2">
                                <Badge variant={"outline"} >{index + 1}</Badge>
                                <p className="font-semibold">{phase.name}</p>
                            </div>
                            <p className="text-xs text-muted-foreground">{phase.status}</p>
                        </Button>
                    ))}
                </div>

            </aside>
            <div className="flex w-full">
                <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
            </div>



        </div>
    );
}


interface ExecutionLabelProps {
    icon: LucideIcon;
    label: string;
    value: ReactNode;
}

export function ExecutionLabel({ icon, label, value }: ExecutionLabelProps) {
    const Icon = icon;
    return (
        <div className="flex justify-between items-center py-2 px-4 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
                <Icon size={20} className="stroke-muted-foreground flex items-center gap-2" />
                <span>{label}</span>
            </div>
            <div className="font-semibold capitalize flex gap-2 items-center">
                {value}
            </div>
        </div>
    );
}

