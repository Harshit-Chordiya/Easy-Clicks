"use client";

import { downloadInvoice } from "@/actions/billing/";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

export default function InvoiceBtn({ id }: { id: string }) {
    const mutation = useMutation({
        mutationFn: downloadInvoice,
        onSuccess: (url) => {
            window.location.href = url as string;
        },
        onError: () => {
            toast.error("Failed to download invoice", {
                id: "download-invoice",
            });
        },
    });

    return (
        <Button
            variant="ghost"
            size="sm"
            className="gap-2 px-1 text-xs text-muted-foreground"
            disabled={mutation.isPending}
            onClick={() => mutation.mutate(id)}
        >
            Invoice
            {mutation.isPending && (
                <Loader2Icon size={16} className="size-4 animate-spin" />
            )}
        </Button>
    );
}
