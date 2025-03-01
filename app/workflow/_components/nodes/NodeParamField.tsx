"use client";

import { TaskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./param/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import BrowserInstanceParam from "./param/BrowserInstanceParam";
import SelectParam from "./param/SelectParam";
import CredentialsParam from "./param/credentials-param";

export default function NodeParamField({
  param,
  nodeId,
  disabled,
}: {
  param: TaskParam;
  nodeId: string;
  disabled?: boolean;
}) {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[param.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [param.name]: newValue,
        },
      });
    },
    [updateNodeData, param.name, node?.data.inputs, nodeId],
  );

  switch (param.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          param={param}
          value={value}
          updateNodeParamValues={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          param={param}
          value={""}
          updateNodeParamValues={updateNodeParamValue}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={param}
          value={value}
          updateNodeParamValues={updateNodeParamValue}
          disabled={disabled}
        />
      );
    case TaskParamType.CREDENTIAL:
      return (
        <CredentialsParam
          param={param}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-sm text-muted-foreground">Not implemented</p>
        </div>
      );
  }
}
