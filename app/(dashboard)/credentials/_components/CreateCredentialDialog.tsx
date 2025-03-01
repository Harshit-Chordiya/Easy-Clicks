"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Loader2, Plus, ShieldEllipsisIcon } from "lucide-react";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
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
import {
    createCredentialSchema,
    createCredentialSchemaType,
} from "@/schema/credential";
import { createCredential } from "@/actions/credentials/createCredentials";

export default function CreateCredentialDialog({
    triggerText,
}: {
    triggerText?: string;
}) {
    const [isOpen, setIsOpen] = useState(false);

    const form = useForm<createCredentialSchemaType>({
        resolver: zodResolver(createCredentialSchema),
        defaultValues: {
            name: "",
            value: "",
        },
    });

    const { mutate, isPending } = useMutation({
        mutationFn: createCredential,
        onSuccess: () => {
            toast.success("Credential created successfully!", {
                id: "create-credential",
            });
            form.reset();
            setIsOpen(false);
        },
        onError: () => {
            toast.error("Failed to create credential", {
                id: "create-credential",
            });
        },
    });

    const onSubmit = useCallback(
        (values: createCredentialSchemaType) => {
            toast.loading("Creating credential...", {
                id: "create-credential",
            });
            mutate(values);
        },
        [mutate],
    );

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4" />
                    {triggerText ?? "Create"}
                </Button>
            </DialogTrigger>
            <DialogContent className="px-0">
                <CustomDialogHeader
                    icon={ShieldEllipsisIcon}
                    title="Create credential"
                />
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
                                            Give your credential a unique, descriptive name
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="value"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex items-center gap-1">
                                            Value
                                            <p className="text-xs text-primary">(required)</p>
                                        </FormLabel>
                                        <FormControl>
                                            <Textarea className="resize-none" {...field} />
                                        </FormControl>
                                        <FormDescription className="text-xs">
                                            Enter the value associated with this credential
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending && <Loader2 className="animate-spin" />}
                                {isPending ? "Creating workflow..." : "Continue"}
                            </Button>
                        </form>
                    </Form>
                </div>
            </DialogContent>
        </Dialog>
    );
}
