export async function encryptRequest(apiKey: string) {
    const encryptionRequest = await fetch((process.env.WORKER_URL as string) + "/encrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: apiKey }),
    });

    const { encryptedData, iv } = (await encryptionRequest.json()) as { encryptedData: string; iv: string };

    return { encryptedData, iv };
}

export async function decryptRequest({ encryptedData, iv }: { encryptedData: string; iv: string }) {
    const encryptionRequest = await fetch((process.env.WORKER_URL as string) + "/decrypt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ encryptedData, iv }),
    });

    const { decryptedData } = (await encryptionRequest.json()) as { decryptedData: string };

    return decryptedData;
}
