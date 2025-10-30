import type { Credential, SessionCredentialType } from "src/types";

export async function getAllCredentials(): Promise<Credential[]> {
    const response = await chrome.storage.local.get<{ credentials: Credential[] }>("credentials");
    return response.credentials ?? [];
}

export async function addCredential(payload: Credential): Promise<void> {
    const credentials = await getAllCredentials();

    if (!credentials.length) {
        payload.isDefault = true;
    }

    credentials.push(payload);
    await chrome.storage.local.set<{ credentials: Credential[] }>({ credentials });
}

export async function setDefaultCredential(id: string): Promise<Credential[]> {
    const credentials = await getAllCredentials();

    const newCredentials = credentials.map(credential => {
        if (credential.id === id) {
            credential.isDefault = true;
        } else {
            credential.isDefault = false;
        }

        return credential;
    });

    await chrome.storage.local.set<{ credentials: Credential[] }>({ credentials: newCredentials });

    return newCredentials;
}

export async function deleteCredential(id: string): Promise<Credential[]> {
    const credentials = await getAllCredentials();
    const newCredentials = credentials.filter(credential => credential.id !== id);

    if (!newCredentials.some(credential => credential.isDefault) && newCredentials.length) {
        newCredentials[0].isDefault = true;
    }

    await chrome.storage.local.set<{ credentials: Credential[] }>({ credentials: newCredentials });

    return newCredentials;
}

export async function getSessionCredential(): Promise<SessionCredentialType | undefined> {
    const response = await chrome.storage.session.get<{ credential: SessionCredentialType }>("credential");
    return response.credential;
}

export function setSessionCredential<T>(payload: T): Promise<void> {
    return chrome.storage.session.set<{ credential: typeof payload }>({ credential: payload });
}
