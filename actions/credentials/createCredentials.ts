"use server";

import { createCredentialSchemaType } from "@/schema/credential";
import { createCredentialSchema } from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";

export async function createCredential(form: createCredentialSchemaType) {
    const { success, data } = createCredentialSchema.safeParse(form);
    if (!success) throw new Error("Invalid form data");

    const { userId } = auth();
    if (!userId) throw new Error("User not authenticated");

    // Encrypt the value
    const encryptedValue = symmetricEncrypt(data.value);

    const result = await prisma.credential.create({
        data: {
            userId,
            name: data.name,
            value: encryptedValue,
        },
    });

    if (!result) throw new Error("Failed to create credential");

    revalidatePath("/credentials");
}
