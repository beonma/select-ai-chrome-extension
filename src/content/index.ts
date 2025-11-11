import * as styles from "./index.module.css";
import RephraseSVG from "../assets/svg/rephrase.svg";
import SpellingSVG from "../assets/svg/spelling.svg";
import LoadingSVG from "../assets/svg/loading.svg";
import CopySVG from "../assets/svg/copy.svg";
import CheckSVG from "../assets/svg/check.svg";
import SummarizeSVG from "../assets/svg/summarize.svg";
import ExplainSVG from "../assets/svg/explain.svg";
import type { EditableElement, SessionCredentialType } from "src/types";
import Provider from "@src/providers/Provider";
import getProvider from "@src/providers/getProvider";

let provider: InstanceType<typeof Provider> | undefined = undefined;

let selectionTimeoutDOM: ReturnType<typeof setTimeout>;
let selectionTimeoutInput: ReturnType<typeof setTimeout>;
let selectionRef: {
    parent: HTMLElement | EditableElement;
    isInput: boolean;
    start: number;
    end: number;
    text: string;
};

const rephraseTones = [
    "formal",
    "informal",
    "friendly",
    "persuasive",
    "neutral",
    "assertive",
    "apologetic",
    "humorous",
    "sympathetic",
];

const summarizeType = ["default", "headline"];

const buttons = ["accept", "discard"];

const port = chrome.runtime.connect({ name: "CredentialPort" });

port.onMessage.addListener((message: SessionCredentialType | undefined) => {
    if (typeof message === "undefined") {
        return;
    }

    provider = getProvider(message);
});

const html = `
<div class="${styles.container}">
    <div class="${styles.toolbar}">
        <div class="${styles["top-bar"]}">
            <button class="${styles.btn}">rewrite
                ${RephraseSVG}
            </button>
            <button class="${styles.btn}">proof read
                ${CheckSVG}
            </button>
            <button class="${styles.btn}">fix spelling
                ${SpellingSVG}
            </button>
            <button class="${styles.btn}">summarize
                ${SummarizeSVG}
            </button>
            <button class="${styles.btn}">explain
                ${ExplainSVG}
            </button>
        </div>
        <div toolbar class="${styles["rephrase-bar"]}">
            ${rephraseTones.map(tone => '<button class="' + styles.btn + '">' + tone + "</button>").join("")}
        </div>
        <div toolbar class="${styles["summarize-bar"]}">
            ${summarizeType.map(type => '<button class="' + styles.btn + '">' + type + "</button>").join("")}
        </div>
    </div>
    <div class="${styles.content}">
        <p></p>
        <div class="${styles.action__container}">
            <div class="${styles.action__btns_left_container}">
                ${buttons.map(btn => `<button class="${styles.btn}">${btn}</button>`).join("")}
            </div>
            <button class="${styles.btn} ${styles.copyBtn}">copy & close${CopySVG}</button>
        </div>
    </div>
</div>
`;

document.querySelector("body")?.insertAdjacentHTML("afterbegin", html);

const htmlNode = <HTMLElement>document.querySelector(`.${styles.container}`);
const topToolbar = <HTMLDivElement>htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]}`);
const rephraseToolbar = <HTMLDivElement>htmlNode.querySelector(`.${styles.toolbar} .${styles["rephrase-bar"]}`);
const summarizeToolbar = <HTMLDivElement>htmlNode.querySelector(`.${styles.toolbar} .${styles["summarize-bar"]}`);

const editableElements: NodeListOf<HTMLTextAreaElement | HTMLInputElement> =
    document.querySelectorAll("input, textarea");

const rephraseSubBtns = <NodeListOf<HTMLButtonElement>>(
    htmlNode.querySelectorAll(`.${styles.toolbar} .${styles["rephrase-bar"]} button`)
);

const summarizeSubBtns = <NodeListOf<HTMLButtonElement>>(
    htmlNode.querySelectorAll(`.${styles.toolbar} .${styles["summarize-bar"]} button`)
);

const rephraseBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]} button:first-child`)
);
const proofReadBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]} button:nth-child(2)`)
);
const fixSpellingBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]} button:nth-child(3)`)
);
const summarizeBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]} button:nth-child(4)`)
);
const explainBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} .${styles["top-bar"]} button:nth-child(5)`)
);

const content = <HTMLDivElement>htmlNode.querySelector(`.${styles.content}`);
const contentParagraph = <HTMLParagraphElement>content.querySelector("p");

const acceptButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} div button:first-child`);
const discardButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} div button:nth-child(2)`);
const copyButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} > button`);

document.addEventListener("click", event => {
    // COMMENT typescript forcing as Node in event.target
    // TODO To hide the toolbar, up to two clicks are required within the parent element of the currently selected text.

    // INFO The OR operator in this if statement is added to handle a specific case where the path of the SVG is clicked. In this scenario, the parent element could not be determined, and thus this check could not verify if it was within the html node.

    if (htmlNode.contains(event.target as Node) || htmlNode.contains(event.currentTarget as Node)) {
        if (selectionRef.isInput) {
            window.getSelection()?.removeAllRanges();
        }
        return;
    }

    if (window.getSelection()?.type === "Range") {
        return;
    }

    hideToolbar();
});

document.addEventListener("keydown", e => {
    if (e.code === "Escape" || window.getSelection()?.type !== "Range") {
        hideToolbar();
    }
});

editableElements.forEach(el => {
    el.addEventListener("select", event => {
        // COMMENT The event continues to trigger even after interacting with the toolbar element (absolute element), despite no changes in the text selection.

        const editableTarget = event.target as EditableElement;
        showOnEditableElement(editableTarget);
    });
});

document.addEventListener("selectionchange", () => {
    const selection = window.getSelection();

    if (selection?.type !== "Range") {
        return;
    }

    const range = selection.getRangeAt(0);
    const parentElement = range.startContainer.parentElement;

    if (range.toString() === "" || !parentElement) {
        // INFO This is a fallback mechanism. Sometimes, selection on an input element triggers a DOM selection event. This code acts as a last resort to check if a selection exists within a nested input element.

        const editableTarget = geEditableChild(range.startContainer);

        if (editableTarget) {
            showOnEditableElement(editableTarget);
        }

        return;
    }

    showOnSelectionChange(range, parentElement);
});

rephraseBtn.addEventListener("click", onRephraseClick);
proofReadBtn.addEventListener("click", generateProofRead);
fixSpellingBtn.addEventListener("click", generateFixSpelling);
summarizeBtn.addEventListener("click", onSummarizeClick);
explainBtn.addEventListener("click", generateExplain);

rephraseSubBtns.forEach(el => {
    el.addEventListener("click", generateRephrase);
});

summarizeSubBtns.forEach(el => {
    el.addEventListener("click", generateSummarize);
});

acceptButton.addEventListener("click", () => {
    const parentElement = selectionRef.parent;

    if (parentElement instanceof HTMLInputElement || parentElement instanceof HTMLTextAreaElement) {
        const newContent = getNewContent(parentElement.value);
        parentElement.value = newContent;

        const event = new InputEvent("input", { bubbles: true });
        parentElement.dispatchEvent(event);
    }

    if (parentElement.getAttribute("contenteditable") === "true" && parentElement.textContent) {
        const newContent = getNewContent(parentElement.textContent);
        parentElement.textContent = newContent;

        const event = new InputEvent("input", { bubbles: true });
        parentElement.dispatchEvent(event);
    }

    if (parentElement instanceof HTMLElement && parentElement.textContent) {
        const newContent = getNewContent(parentElement.textContent);
        parentElement.textContent = newContent;
    }

    hideToolbar();
});

discardButton.addEventListener("click", hideToolbar);
copyButton.addEventListener("click", async () => {
    if (contentParagraph.textContent) {
        await navigator.clipboard.writeText(contentParagraph.textContent);
        hideToolbar();
    }
});

function onRephraseClick() {
    topToolbar.style.display = "none";
    rephraseToolbar.classList.add(styles.visible);
}

function onSummarizeClick() {
    topToolbar.style.display = "none";
    summarizeToolbar.classList.add(styles.visible);
}

async function generateRephrase(this: HTMLButtonElement) {
    const prevElementHTML = this.innerHTML;
    const tone = this.textContent;

    this.style.setProperty("padding", "6px 8px", "important");
    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        if (typeof provider === "undefined") {
            throw new Error("couldn't initialize a provider.");
        }

        //INFO typescript complaining about tone possibly being null, knowing this.textContent will always yield a string
        const result = provider.rephrase(selectionRef.text, tone!);

        for await (const chunk of result) {
            const spanElement = document.createElement("span");
            spanElement.textContent = chunk;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        if (e instanceof Error) {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e.message;
        } else {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e;
        }
    } finally {
        this.style.setProperty("padding", "13px 8px", "important");
        this.innerHTML = prevElementHTML;
    }
}

async function generateFixSpelling(this: HTMLButtonElement) {
    const prevElementHTML = this.innerHTML;

    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        if (typeof provider === "undefined") {
            throw new Error("couldn't initialize a provider.");
        }

        const result = provider.fixSpelling(selectionRef.text);

        for await (const chunk of result) {
            const spanElement = document.createElement("span");
            spanElement.textContent = chunk;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        if (e instanceof Error) {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e.message;
        } else {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e;
        }
    } finally {
        this.innerHTML = prevElementHTML;
    }
}

async function generateProofRead(this: HTMLButtonElement) {
    const prevElementHTML = this.innerHTML;

    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        if (typeof provider === "undefined") {
            throw new Error("couldn't initialize a provider.");
        }

        const result = provider.proofRead(selectionRef.text);

        for await (const chunk of result) {
            const spanElement = document.createElement("span");
            spanElement.textContent = chunk;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        if (e instanceof Error) {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e.message;
        } else {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e;
        }
    } finally {
        this.innerHTML = prevElementHTML;
    }
}

async function generateSummarize(this: HTMLButtonElement) {
    const prevElementHTML = this.innerHTML;
    const type = this.textContent;

    this.style.setProperty("padding", "6px 8px", "important");
    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        if (typeof provider === "undefined") {
            throw new Error("couldn't initialize a provider.");
        }

        const result = provider.summarize(selectionRef.text, type === "headline");

        for await (const chunk of result) {
            const spanElement = document.createElement("span");
            spanElement.textContent = chunk;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        if (e instanceof Error) {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e.message;
        } else {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e;
        }
    } finally {
        this.style.setProperty("padding", "13px 8px", "important");
        this.innerHTML = prevElementHTML;
    }
}

async function generateExplain(this: HTMLButtonElement) {
    const prevElementHTML = this.innerHTML;

    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        if (typeof provider === "undefined") {
            throw new Error("couldn't initialize a provider.");
        }

        const result = provider.explain(selectionRef.text);

        for await (const chunk of result) {
            const spanElement = document.createElement("span");
            spanElement.textContent = chunk;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        if (e instanceof Error) {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e.message;
        } else {
            contentParagraph.innerHTML = "Oops ! something went wrong.<br>" + e;
        }
    } finally {
        this.innerHTML = prevElementHTML;
    }
}

function hideToolbar() {
    htmlNode.classList.remove(styles.visible);
    rephraseToolbar.classList.remove(styles.visible);
    summarizeToolbar.classList.remove(styles.visible);

    setTimeout(() => {
        topToolbar.style.display = "flex";
        content.style.display = "none";
        contentParagraph.innerHTML = "";
    }, 500);
}

function showToolbar(rect: DOMRect) {
    const { bottom: offsetY, left: offsetX } = rect;

    htmlNode.classList.add(styles.visible);
    htmlNode.style.top = `${offsetY + window.scrollY + 10}px`;
    htmlNode.style.left = `${offsetX}px`;
}

function getNewContent(content: string): string {
    return (
        content.slice(0, selectionRef.start) +
        contentParagraph.textContent +
        content.slice(selectionRef.end || content.length - 1, content.length - 1)
    );
}

function geEditableChild(target: Node): EditableElement | void {
    for (const node of Array.from(target.childNodes)) {
        if (/INPUT|TEXTAREA/.test(node.nodeName)) {
            return node as EditableElement;
        }

        if (node.hasChildNodes()) {
            geEditableChild(node);
        }
    }
}

function showOnEditableElement(target: EditableElement): void {
    clearTimeout(selectionTimeoutInput);

    if (
        typeof target.selectionStart !== "number" ||
        typeof target.selectionEnd !== "number" ||
        (target.selectionStart === 0 && target.selectionEnd === 0)
    ) {
        return;
    }

    const selectionStart = target.selectionStart;
    const selectionEnd = target.selectionEnd;
    const selectionInput = target.value.substring(selectionStart!, selectionEnd!);

    selectionTimeoutInput = setTimeout(() => {
        showToolbar(target.getBoundingClientRect());

        selectionRef = {
            text: selectionInput,
            parent: target!,
            start: selectionStart!,
            end: selectionEnd!,
            isInput: true,
        };
    }, 500);
}

function showOnSelectionChange(range: Range, parent: HTMLElement): void {
    clearTimeout(selectionTimeoutDOM);

    selectionTimeoutDOM = setTimeout(() => {
        showToolbar(range.getBoundingClientRect());

        selectionRef = {
            parent: parent,
            text: range.toString(),
            isInput: false,
            start: range.startOffset,
            end: range.endOffset,
        };
    }, 500);
}
