"use client";

import React from "react";
import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";



interface EditorProps {
  workflow: Workflow;
}

export default function Editor({ workflow }: EditorProps) {
  return (
    <ReactFlowProvider>
      <div className="flex flex-col h-full w-full overflow-hidden">
        <Topbar title="workflow editor" subtitle={workflow.name} workflowId={workflow.id}/>
        <section className="flex h-full overflow-auto">
          <FlowEditor workflow={workflow} />
        </section>
      </div>
    </ReactFlowProvider>
  );
}
