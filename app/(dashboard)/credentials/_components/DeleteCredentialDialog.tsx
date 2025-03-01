"use client";

import { deleteCredential } from "@/actions/credentials/deleteCredentials";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation } from "@tanstack/react-query";
import { AlertCircleIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type Props = {
    name: string;
};

export default function DeleteCredentialDialog({ name }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [confirmText, setConfirmText] = useState("");

    const deleteMutation = useMutation({
        mutationFn: deleteCredential,
        onSuccess: () => {
            toast.success("Credential deleted successfully!", {
                id: name,
            });
            setConfirmText("");
        },
        onError: () => {
            toast.error("Failed to delete credential", {
                id: name,
            });
        },
    });

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogTrigger asChild>
                <Button variant="destructive" size="icon">
                    <XIcon size={18} />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="flex items-center gap-2">
                        <AlertCircleIcon className="size-6" />
                        <AlertDialogTitle>Delete this credential?</AlertDialogTitle>
                    </div>

                    <AlertDialogDescription>
                        This action is permanent and cannot be undone. Are you sure you want
                        to delete this credential?
                        <div className="flex flex-col gap-2 py-4">
                            <p>
                                Enter <b>{`"${name}"`}</b> below to confirm:
                            </p>
                            <Input
                                value={confirmText}
                                onChange={(e) => setConfirmText(e.target.value)}
                            />
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setConfirmText("")}>
                        Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                        disabled={confirmText !== name || deleteMutation.isPending}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        onClick={() => {
                            toast.loading("Deleting credential...", {
                                id: name,
                            });
                            deleteMutation.mutate(name);
                        }}
                    >
                        Delete
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
