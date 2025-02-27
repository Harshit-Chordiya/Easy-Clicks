"use client"
import { useReactFlow } from "@xyflow/react";
import { TaskParam, TaskParamType } from "@/types/task";
import StringParam from "./StringParam"; // Ensure this path is correct
import { AppNode } from "@/types/appNode";
import { useCallback } from "react";

interface NodeParamFieldProps {
    param: TaskParam;
    nodeId: string;
}

function NodeParamField({ param, nodeId }: NodeParamFieldProps) {
    const { updateNodeData, getNode } = useReactFlow();
    const node = getNode(nodeId) as AppNode;

    const value = node?.data?.inputs?.[param.name];



    const updateNodeParamValue = useCallback(
        (newValue: string) => {
        updateNodeData(nodeId, {
            inputs: {
                ...node?.data.inputs,
                [param.name]: newValue,
            },
        });
    },
        [nodeId, updateNodeData, param.name, node?.data.inputs]
);


    switch (param.type) {
        case TaskParamType.STRING:
            return <StringParam param={param} value={value} updateNodeParamValues={updateNodeParamValue} />;

        default:
            return (
                <div className="w-full">
                    <p className=" text-xs text-muted-foreground">Not implemented</p>
                </div>
            );
    }
}

export default NodeParamField;
