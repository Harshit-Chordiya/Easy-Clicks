import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { LucideProps, EyeIcon } from "lucide-react";
import React from "react";

export const WaitForElementTask = {
    type: TaskType.WAIT_FOR_ELEMENT,
    label: "Wait for Element",
    icon: (props: LucideProps) => (
        <EyeIcon className="stroke-amber-400" {...props} />
    ),
    isEntryPoint: false,
    credits: 1,
    inputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
            required: true,
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            required: true,
        },
        {
            name: "Visibility",
            type: TaskParamType.SELECT,
            required: true,
            hideHandle: true,
            options: [
                { label: "Visible", value: "visible" },
                { label: "Hidden", value: "hidden" },
            ],
        },
    ] as const,
    outputs: [
        {
            name: "Web page",
            type: TaskParamType.BROWSER_INSTANCE,
        },
    ] as const,
} satisfies WorkflowTask;
