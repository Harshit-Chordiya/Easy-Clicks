"use client";

import React from "react";
import { Period } from "@/types/analytics";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

const MONTHLY_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default function PeriodSelector({
    periods,
    selectedPeriod,
}: {
    periods: Period[];
    selectedPeriod: Period;
}) {
    const searchParams = useSearchParams();
    const router = useRouter();
    return (
        <Select
            value={`${selectedPeriod.month}-${selectedPeriod.year}`}
            onValueChange={(value) => {
                const [month, year] = value.split("-");
                const params = new URLSearchParams(searchParams);
                params.set("month", month);
                params.set("year", year);
                router.push(`?${params.toString()}`);
            }}
        >
            <SelectTrigger className="w-[180px]">
                <SelectValue />
            </SelectTrigger>
            <SelectContent>
                {periods.map((period) => {
                    const periodString = `${MONTHLY_NAMES[period.month]} ${period.year}`;
                    return (
                        <SelectItem
                            key={periodString}
                            value={`${period.month}-${period.year}`}
                        >
                            {periodString}
                        </SelectItem>
                    );
                })}
            </SelectContent>
        </Select>
    );
}
