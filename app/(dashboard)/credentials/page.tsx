import React, { Suspense } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { LockKeyholeIcon, ShieldIcon, ShieldOffIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { getCredentialsForUser } from "@/actions/credentials/getCredentialsForUser";
import { Card } from "@/components/ui/card";
import CreateCredentialDialog from "./_components/CreateCredentialDialog";
import { formatDistanceToNow } from "date-fns";
import DeleteCredentialDialog from "./_components/delete-credential-dialog";

export default function CredentialsPage() {
    return (
        <div className="flex h-full flex-1 flex-col">
            <div className="flex justify-between">
                <div className="flex flex-col">
                    <h1 className="text-3xl font-bold">Credentials</h1>
                    <p className="text-muted-foreground">Manage your credentials</p>
                </div>
                <CreateCredentialDialog />
            </div>

            <div className="h-full space-y-8 py-6">
                <Alert>
                    <ShieldIcon className="size-4 stroke-primary" />
                    <AlertTitle className="text-primary">Encryption</AlertTitle>
                    <AlertDescription>
                        All information is securely encrypted, so you can rest easy knowing
                        that your data is safe.
                    </AlertDescription>
                </Alert>

                <Suspense fallback={<Skeleton className="h-[300px] w-full" />}>
                    <UserCredentials />
                </Suspense>
            </div>
        </div>
    );
}

async function UserCredentials() {
    const credentials = await getCredentialsForUser();
    if (!credentials) return <div>No credentials found</div>;

    if (credentials.length === 0)
        return (
            <Card className="w-full p-4">
                <div className="flex flex-col items-center justify-center gap-4">
                    <div className="flex size-20 items-center justify-center rounded-full bg-accent">
                        <ShieldOffIcon size={40} className="stroke-primary" />
                    </div>
                    <div className="flex flex-col gap-1 text-center">
                        <p className="font-bold">No credentials created yet</p>
                        <p className="text-muted-foreground">
                            Click the button below to create your first credential
                        </p>
                    </div>
                    <CreateCredentialDialog triggerText="Create your first credential" />
                </div>
            </Card>
        );
    return (
        <div className="flex flex-wrap gap-2">
            {credentials.map((credential) => {
                const createdAt = formatDistanceToNow(credential.createdAt, {
                    addSuffix: true,
                });
                return (
                    <Card key={credential.id} className="flex w-full justify-between p-4">
                        <div className="flex items-center justify-center gap-2">
                            <div className="flex size-8 items-center justify-center rounded-full bg-primary/10">
                                <LockKeyholeIcon size={18} className="stroke-primary" />
                            </div>
                            <div>
                                <p className="font-bold">{credential.name}</p>
                                <p className="text-xs text-muted-foreground">{createdAt}</p>
                            </div>
                        </div>
                        <DeleteCredentialDialog name={credential.name} />
                    </Card>
                );
            })}
        </div>
    );
}
