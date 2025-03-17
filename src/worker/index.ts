import { Credential } from "@src/types";
import { decryptRequest } from "@src/utils/encryption";
import { getAllCredentials, getSessionCredential, setSessionCredential } from "@src/utils/storage";

chrome.runtime.onStartup.addListener(async () => {
    const credentials = await getAllCredentials();

    if (!credentials.length) {
        setActionBadge([]);
        return;
    }

    await updateSessionCredential(credentials as Credential[]);
});

chrome.runtime.onConnect.addListener(async port => {
    const sessionCredential = await getSessionCredential();
    port.postMessage(sessionCredential);
});

chrome.storage.local.onChanged.addListener(async response => {
    setActionBadge(response.credentials.newValue as Credential[]);
    const { oldValue, newValue }: Partial<Record<keyof typeof response.credentials, Credential[]>> =
        response.credentials;

    const oldDefaultId = oldValue?.find(cred => cred.isDefault)?.id;
    const newDefaultId = newValue?.find(cred => cred.isDefault)?.id;

    if (oldDefaultId === newDefaultId) {
        return;
    }

    await updateSessionCredential(newValue as Credential[]);

    const tabs = await chrome.tabs.query({});

    for (const tab of tabs) {
        setActionBadgeRefresh(tab.id);
    }
});

function setActionBadge(credentials: Credential[]) {
    if (!credentials.length) {
        chrome.action.setBadgeText({ text: "!" });
        chrome.action.setBadgeTextColor({ color: "white" });
        chrome.action.setBadgeBackgroundColor({ color: "orange" });
        chrome.action.setTitle({ title: "You don't have any model set !" });
    } else {
        chrome.action.setBadgeText({ text: "" });
        chrome.action.setTitle({ title: "SelectAI" });
    }
}

function setActionBadgeRefresh(tabId: number | undefined) {
    chrome.action.setBadgeText({ text: "⟳", tabId });
    chrome.action.setBadgeTextColor({ color: "white", tabId });
    chrome.action.setBadgeBackgroundColor({ color: "#4f646f", tabId });
    chrome.action.setTitle({ title: "Refresh the page for changes to take effect", tabId });
}

async function updateSessionCredential(credentials: Credential[]) {
    const defaultCredential = credentials.find(cred => cred.isDefault === true);

    if (!defaultCredential) {
        return;
    }

    const {
        apiKey: { encryptedData, iv },
    } = defaultCredential;

    const decryptedApiKey = await decryptRequest({ encryptedData, iv });

    await setSessionCredential({
        apiKey: decryptedApiKey,
        providerName: defaultCredential.provider,
        model: defaultCredential.model,
    });
}
