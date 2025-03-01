"use client";

import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavigationTabs({ workflowId }: { workflowId: string }) {
  const pathname = usePathname();
  const active = pathname.split("/")[2];
  return (
    <Tabs value={active} className="w-[400px]">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="editor" asChild>
          <Link href={`/workflow/editor/${workflowId}`} className="w-full">
            Editor
          </Link>
        </TabsTrigger>
        <TabsTrigger value="runs" asChild>
          <Link href={`/workflow/runs/${workflowId}`} className="w-full">
            Runs
          </Link>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
