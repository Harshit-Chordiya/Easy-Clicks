"use client";

import { ReactNode } from "react";



function NodeCard({ nodeId, children }: {nodeId: string; children: ReactNode;}) {
  return <div>{children}</div>;
}

export default NodeCard;
