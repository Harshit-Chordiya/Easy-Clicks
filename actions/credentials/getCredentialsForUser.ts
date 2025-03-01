"use server";

import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";

export async function getCredentialsForUser() {
    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    return prisma.credential.findMany({
        where: {
            userId,
        },
        orderBy: {
            name: "asc",
        },
    });
}
