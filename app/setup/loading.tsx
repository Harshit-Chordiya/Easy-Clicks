import Logo from "@/components/Logo";
import { Separator } from "@/components/ui/separator";
import { Loader2Icon } from "lucide-react";
import React from "react";

export default function Loading() {
    return (
        <div className="flex h-screen w-full flex-col items-center justify-center gap-4">
            <Logo iconSize={50} fontSize="text-3xl" />
            <Separator />
            <div className="flex items-center gap-2 stroke-primary">
                <Loader2Icon size={16} className="animate-spin stroke-primary" />
                <p className="text-muted-foreground">Setting up your account</p>
            </div>
        </div>
    );
}
