
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/registry";

export function calculateWorkflowCost(nodes: AppNode[]) {
  return nodes.reduce(
    (acc, node) => acc + TaskRegistry[node.data.type].credits,
    0,
  );
}
