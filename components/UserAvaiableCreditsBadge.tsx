"use client";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getAvailableCredits } from "@/actions/billing/getAvailableCredits";
import { CoinsIcon, Loader2Icon } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import ReactCountUpWrapper from "./ReactCountUpWrapper";
import { buttonVariants } from "./ui/button";

export default function AvailableCreditsBadge() {
    const query = useQuery({
        queryKey: ["available-credits"],
        queryFn: () => getAvailableCredits(),
        refetchInterval: 30 * 1000,
    });
    return (
        <Link
            href="/billing"
            className={cn(
                "w-full items-center space-x-2",
                buttonVariants({
                    variant: "outline",
                }),
            )}
        >
            <CoinsIcon size={20} className="text-primary" />
            <span className="font-semibold capitalize">
                {query.isLoading && <Loader2Icon className="size-4 animate-spin" />}
                {!query.isLoading && query.data && (
                    <ReactCountUpWrapper value={query.data} />
                )}
                {!query.isLoading && query.data === undefined && "-"}
            </span>
        </Link>
    );
}
