import { TaskParamType, TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import { CodeIcon, GlobeIcon, LucideProps, TextIcon } from "lucide-react";

export const ExtractTextFromElementTask = {
    type: TaskType.EXTRACT_TEXT_FROM_ELEMENT,
    label: "Extract Text From Element",
    icon: (props: LucideProps) => (
        <TextIcon className="stroke-pink-400" {...props} />
    ),
    isEntryPoint: false,
    credits: 2,
    inputs: [
        {
            name: "Html",
            type: TaskParamType.STRING,
            required: true,
            variant: "textarea",
        },
        {
            name: "Selector",
            type: TaskParamType.STRING,
            required: true,
        },
    ] as const,
    outputs: [
        {
            name: "Extracted text",
            type: TaskParamType.STRING,
        },
    ] as const,
} satisfies WorkflowTask;
