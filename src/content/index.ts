import { fixSpelling, rephrase } from "../utils/ai-script";
import * as styles from "./index.module.css";
import RephraseSVG from "../assets/svg/rephrase.svg";
import CaretSVG from "../assets/svg/caret.svg";
import SpellingSVG from "../assets/svg/spelling.svg";
import LoadingSVG from "../assets/svg/loading.svg";

let selectionTimeout: ReturnType<typeof setTimeout>;
let selectionRef: {
    parent: HTMLElement | HTMLInputElement | HTMLTextAreaElement;
    isInput: boolean;
    start: number;
    end: number;
    text: string;
};

const rephraseTones = ["formal", "convince", "normal", "angry"];
const buttons = ["accept", "discard", "try again"];

const html = `
<div class="${styles.container}">
    <div class="${styles.toolbar}">
        <button class="${styles.btn}">rephrase
            ${RephraseSVG}
        </button>
        <div class="${styles.select__container}">
            <select id="rephrase-tone">
                ${rephraseTones.map(tone => `<option value="${tone}">${tone}</option>`).join("")}
            </select>
            <span class="${styles.select__caret}">
                ${CaretSVG}
            </span>
        </div>
        <button class="${styles.btn}">fix spelling
            ${SpellingSVG}
        </button>
    </div>
    <div class="${styles.content}">
        <p></p>
        <div class="${styles.action__container}">
            ${buttons.map(btn => `<button class="${styles.btn}">${btn}</button>`).join("")}
        </div>
    </div>
</div>
`;

document.querySelector("body")?.insertAdjacentHTML("afterbegin", html);

const htmlNode = <HTMLElement>document.querySelector(`.${styles.container}`);
const editableElements: NodeListOf<HTMLTextAreaElement | HTMLInputElement> =
    document.querySelectorAll("input, textarea");

const rephraseBtn = <HTMLButtonElement>htmlNode.querySelector(`.${styles.toolbar} button:first-child`);
const fixSpellingBtn = <HTMLButtonElement>htmlNode.querySelector(`.${styles.toolbar} button:last-child`);
const rephraseSelect = <HTMLSelectElement>htmlNode.querySelector(`.${styles.toolbar} select`);

const content = <HTMLDivElement>htmlNode.querySelector(`.${styles.content}`);
const contentParagraph = <HTMLParagraphElement>content.querySelector("p");

const acceptButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} button:first-child`);
const discardButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} button:nth-child(2)`);
const tryAgainButton = <HTMLButtonElement>content.querySelector(`.${styles.action__container} button:last-child`);

document.addEventListener("click", event => {
    // COMMENT typescript forcing as Node in event.target
    // TODO To hide the toolbar, up to two clicks are required within the parent element of the currently selected text.
    if (htmlNode.contains(event.target as Node)) {
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
        // INFO no need to add clearTimeout(selectionTimeout), it gets called every time in selectionchange listener

        const target = event.target as HTMLInputElement | HTMLTextAreaElement;

        if (
            typeof target.selectionStart !== "number" ||
            typeof target.selectionEnd !== "number" ||
            (target.selectionStart === 0 && target.selectionEnd === 0)
        ) {
            return;
        }

        const selectionStart = target.selectionStart;
        const selectionEnd = target.selectionEnd;
        const selection = target.value.substring(selectionStart, selectionEnd);

        selectionTimeout = setTimeout(() => {
            showToolbar(target.getBoundingClientRect());

            selectionRef = {
                text: selection,
                parent: target,
                start: selectionStart,
                end: selectionEnd,
                isInput: true,
            };
        }, 500);
    });
});

document.addEventListener("selectionchange", () => {
    clearTimeout(selectionTimeout);

    const selection = window.getSelection();

    if (selection?.type !== "Range") {
        return;
    }

    const range = selection.getRangeAt(0);
    const parentElement = range.startContainer.parentElement;

    if (range.toString() === "" || !parentElement) {
        return;
    }

    selectionTimeout = setTimeout(() => {
        showToolbar(range.getBoundingClientRect());

        selectionRef = {
            parent: parentElement,
            text: range.toString(),
            isInput: false,
            start: range.startOffset,
            end: range.endOffset,
        };
    }, 500);
});

rephraseBtn.addEventListener("click", generateRephrase.bind(rephraseBtn, false));
fixSpellingBtn.addEventListener("click", generateSpellingFix);

acceptButton.addEventListener("click", () => {
    const parentElement = selectionRef.parent;

    if (parentElement instanceof HTMLInputElement || parentElement instanceof HTMLTextAreaElement) {
        const newContent = getNewContent(parentElement.value);
        parentElement.value = newContent;
    }

    if (parentElement instanceof HTMLElement && parentElement.textContent) {
        const newContent = getNewContent(parentElement.textContent);
        parentElement.textContent = newContent;
    }

    hideToolbar();
});

discardButton.addEventListener("click", hideToolbar);
tryAgainButton.addEventListener("click", generateRephrase.bind(rephraseBtn, true));

async function generateRephrase(this: HTMLButtonElement, isRetry: boolean) {
    if (isRetry) {
        this.style.backgroundColor = "#4f646f";
    }

    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        const result = await rephrase(selectionRef.text, rephraseSelect.value);

        for await (const chunk of result.stream) {
            const text = chunk.text();

            const spanElement = document.createElement("span");
            spanElement.textContent = text;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        contentParagraph.textContent = "Oops ! something went wrong.";
    } finally {
        this.removeAttribute("style");
        this.innerHTML = "rephrase" + RephraseSVG;
    }
}

async function generateSpellingFix(this: HTMLButtonElement) {
    this.innerHTML = LoadingSVG;
    content.style.display = "block";
    contentParagraph.innerHTML = "";

    try {
        const result = await fixSpelling(selectionRef.text);

        for await (const chunk of result.stream) {
            const text = chunk.text();

            const spanElement = document.createElement("span");
            spanElement.textContent = text;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        console.error(e);
        content.style.display = "block";
        contentParagraph.textContent = "Oops ! something went wrong.";
    } finally {
        this.innerHTML = "fix spelling" + SpellingSVG;
    }
}

function hideToolbar() {
    htmlNode.style.display = "none";
    content.style.display = "none";
    contentParagraph.innerHTML = "";
}

function showToolbar(rect: DOMRect) {
    const { bottom: offsetY, left: offsetX } = rect;

    htmlNode.style.display = "block";
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
