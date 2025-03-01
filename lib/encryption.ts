// TODO: Why store the iv and encrypted data together in the same string? Shouldn't these be stored separately?

import "server-only";
import crypto from "crypto";

const ALG = "aes-256-cbc";
// key length must be 32 bytes (256 bits)
// openssl rand -hex 32

export function symmetricEncrypt(data: string) {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("Encryption key is not set");

    // initialization vector; ensures that the same input never produces the same output
    const iv = crypto.randomBytes(16);

    const cipher = crypto.createCipheriv(ALG, Buffer.from(key, "hex"), iv);

    let encrypted = cipher.update(data);

    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return iv.toString("hex") + ":" + encrypted.toString("hex");
}

export function symmetricDecrypt(data: string) {
    const key = process.env.ENCRYPTION_KEY;
    if (!key) throw new Error("Encryption key is not set");

    const textParts = data.split(":");
    const iv = Buffer.from(textParts.shift() as string, "hex");
    const encryptedText = Buffer.from(textParts.join(":"), "hex");

    const decipher = crypto.createDecipheriv(ALG, Buffer.from(key, "hex"), iv);

    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
}
