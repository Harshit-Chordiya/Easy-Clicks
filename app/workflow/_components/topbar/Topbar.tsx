"use client";

import TooltipWrapper from "@/components/TooltipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";
import NavigationTabs from "./NavigationTabs";
import PublishBtn from "./PublishBtn";
import UnpublishBtn from "./UnpublishBtn";

export default function Topbar({
    title,
    subtitle,
    workflowId,
    hideButtons = false,
    isPublished = false,
}: {
    title: string;
    subtitle?: string;
    workflowId: string;
    hideButtons?: boolean;
    isPublished?: boolean;
}) {
    const router = useRouter();
    return (
        <header className="sticky top-0 z-10 flex h-[60px] w-full border-separate justify-between border-b-2 bg-background p-2">
            <div className="flex flex-1 gap-1">
                <TooltipWrapper content="Back">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeftIcon size={20} />
                    </Button>
                </TooltipWrapper>
                <div>
                    <p className="truncate text-ellipsis font-bold">{title}</p>
                    {subtitle && (
                        <p className="truncate text-ellipsis text-xs text-muted-foreground">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>
            <NavigationTabs workflowId={workflowId} />
            <div className="flex flex-1 justify-end gap-1">
                {!hideButtons && (
                    <>
                        <ExecuteBtn workflowId={workflowId} />
                        {isPublished && <UnpublishBtn workflowId={workflowId} />}
                        {!isPublished && (
                            <>
                                <SaveBtn workflowId={workflowId} />
                                <PublishBtn workflowId={workflowId} />
                            </>
                        )}
                    </>
                )}
            </div>
        </header>
    );
}
