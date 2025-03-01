"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function setupUser() {
    const { userId } = await auth();
    if (!userId) throw new Error("User not authenticated");

    //* Free Creds for initial use
    await prisma.userBalance.upsert({
        where: { userId },
        update: {},
        create: { userId, credits: 1000 },
    });

    redirect("/");
}