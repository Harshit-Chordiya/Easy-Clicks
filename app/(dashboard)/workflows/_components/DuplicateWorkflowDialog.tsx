"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import {
    createWorkflowSchemaType,
    createWorkflowSchema,
    duplicateWorkflowSchemaType,
    duplicateWorkflowSchema,
} from "@/schema/workflow";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { CopyIcon, Layers2Icon, Loader2 } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { duplicateWorkflow } from "@/actions/workflows/duplicateWorkFlow";
import { cn } from "@/lib/utils";

export default function DuplicateWorkflowDialog({
    triggerText,
    workflowId,
}: {
    triggerText?: string;
    workflowId: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<duplicateWorkflowSchemaType>({
        resolver: zodResolver(duplicateWorkflowSchema),
        defaultValues: {
            workflowId,
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: duplicateWorkflow,
        onSuccess: () => {
            toast.success("Workflow duplicated successfully!", {
                id: "duplicate-workflow",
            });
            setIsOpen(false);
        },
        onError: () => {
            toast.error("Failed to duplicate workflow", {
                id: "duplicate-workflow",
            });
        },
    });

    const onSubmit = useCallback(
        (values: duplicateWorkflowSchemaType) => {
            toast.loading("Duplicating workflow...", {
                id: "duplicate-workflow",
            });
            mutate(values);
        },
        [mutate],
    );

    return (
        <Dialog
            open={isOpen}
            onOpenChange={(open) => {
                form.reset();
                setIsOpen(open);
            }}
        >
            <DialogTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "ml-2 opacity-0 transition-opacity duration-200 group-hover/card:opacity-100",
                    )}
                >
                    <CopyIcon className="size-4 cursor-pointer text-muted-foreground" />
                </Button>
            </DialogTrigger>
            <DialogContent className="px-0">
                <CustomDialogHeader icon={Layers2Icon} title="Duplicate workflow" />
                <div className="p-6">
                    <Form {...form}>
                        <form
                            className="w-full space-y-8"
                            onSubmit={form.handleSubmit(onSubmit)}
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Name
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Give your workflow a unique, descriptive name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Description
                                            <p className="text-xs text-muted-foreground">
                                                (optional)
                                            </p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Provide some details about your workflow&apos;s purpose
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending && <Loader2 className="animate-spin" />}
                                {isPending ? "Duplicating workflow..." : "Continue"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
