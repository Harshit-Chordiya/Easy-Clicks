"use client";

import { purchaseCredits } from "@/actions/billing/purchaseCredits";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CreditsPack, PackId } from "@/types/billing";
import { useMutation } from "@tanstack/react-query";
import { CoinsIcon, CreditCardIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function CreditsPurchase() {
    const [selectedPack, setSelectedPack] = useState(PackId.MEDIUM);

    const mutation = useMutation({
        mutationFn: purchaseCredits,
        onSuccess: () => {
            toast.success("Credits purchased successfully!", {
                id: "purchase-credits",
            });
        },
        onError: () => {
            toast.error("Failed to purchase credits", {
                id: "purchase-credits",
            });
        },
    });

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-2xl font-bold">
                    <CoinsIcon className="size-6 text-primary" />
                    Purchase Credits
                </CardTitle>
                <CardDescription>
                    Select the number of credits you want to purchase
                </CardDescription>
            </CardHeader>
            <CardContent>
                <RadioGroup
                    onValueChange={(value) => setSelectedPack(value as PackId)}
                    value={selectedPack}
                >
                    {CreditsPack.map((pack) => (
                        <div
                            key={pack.id}
                            className="flex cursor-pointer items-center space-x-3 rounded-lg bg-secondary/50 p-3 hover:bg-secondary"
                            onClick={() => setSelectedPack(pack.id)}
                        >
                            <RadioGroupItem value={pack.id} id={pack.id} />
                            <Label className="flex w-full cursor-pointer justify-between">
                                <span className="font-medium">
                                    {pack.name} - {pack.label}
                                </span>
                                <span className="font-bold text-primary">
                                    ${(pack.price / 100).toFixed(2)}
                                </span>
                            </Label>
                        </div>
                    ))}
                </RadioGroup>
            </CardContent>
            <CardFooter className="flex justify-end">
                <Button
                    className="btn btn-primary w-full"
                    disabled={mutation.isPending}
                    onClick={() => mutation.mutate(selectedPack)}
                >
                    <CreditCardIcon className="mr-2 size-5" />
                    Purchase credits
                </Button>
            </CardFooter>
        </Card>
    );
}
