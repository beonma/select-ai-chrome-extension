import { fixSpelling, rephrase } from "../utils/ai-script";
import * as styles from "./index.module.css";
import RephraseSVG from "../assets/svg/rephrase.svg";
import CaretSVG from "../assets/svg/caret.svg";
import SpellingSVG from "../assets/svg/spelling.svg";
import LoadingSVG from "../assets/svg/loading.svg";

const selection = getSelection();
let selectionTimeout: ReturnType<typeof setTimeout>;
let clonedRange: Range;

const rephraseTones = ["formal", "convince", "normal", "angry"];

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
            <button class="${styles.btn}">accept</button>
            <button class="${styles.btn}">discard</button>
            <button class="${styles.btn}">try again</button>
        </div>
    </div>
</div>
`;

document.querySelector("body")?.insertAdjacentHTML("afterbegin", html);

const htmlNode = <HTMLElement>document.querySelector(`.${styles.container}`);

const rephraseBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} button:first-child`)
);
const fixSpellingBtn = <HTMLButtonElement>(
    htmlNode.querySelector(`.${styles.toolbar} button:last-child`)
);
const rephraseSelect = <HTMLSelectElement>htmlNode.querySelector(`.${styles.toolbar} select`);

const content = <HTMLDivElement>htmlNode.querySelector(`.${styles.content}`);
const contentParagraph = <HTMLParagraphElement>content.querySelector("p");

const acceptButton = <HTMLButtonElement>(
    content.querySelector(`.${styles.action__container} button:first-child`)
);
const discardButton = <HTMLButtonElement>(
    content.querySelector(`.${styles.action__container} button:nth-child(2)`)
);
const tryAgainButton = <HTMLButtonElement>(
    content.querySelector(`.${styles.action__container} button:last-child`)
);

document.addEventListener("click", event => {
    // COMMENT typescript forcing as Node in event.target
    if (htmlNode.contains(event.target as Node) || selection?.type === "Range") {
        return;
    }

    hideToolbar();
});

document.addEventListener("selectionchange", () => {
    clearTimeout(selectionTimeout);

    if (selection?.type !== "Range") {
        return;
    }

    selectionTimeout = setTimeout(() => {
        const range = selection.getRangeAt(0);
        const { bottom: offsetY, left: offsetX } = range.getBoundingClientRect();

        htmlNode.style.display = "block";
        htmlNode.style.top = `${offsetY + window.scrollY + 10}px`;
        htmlNode.style.left = `${offsetX}px`;

        clonedRange = range.cloneRange();
    }, 500);
});

rephraseBtn.addEventListener("click", generateRephrase.bind(rephraseBtn, false));
fixSpellingBtn.addEventListener("click", generateSpellingFix);

acceptButton.addEventListener("click", () => {
    const parentElement = clonedRange.startContainer.parentElement;

    if (parentElement) {
        parentElement.textContent = contentParagraph.textContent;
        hideToolbar();
    }
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
        const result = await rephrase(clonedRange.toString(), rephraseSelect.value);

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
        const result = await fixSpelling(clonedRange.toString());

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
