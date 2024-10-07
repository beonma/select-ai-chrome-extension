import { rephrase } from "../utils/ai-script";
import * as styles from "./index.module.css";
import RephraseSVG from "../assets/svg/rephrase.svg";
import CaretSVG from "../assets/svg/caret.svg";
import SpellingSVG from "../assets/svg/spelling.svg";

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
            <button id="accept" class="${styles.btn}">accept</button>
            <button id="discard" class="${styles.btn}">discard</button>
            <button id="try-again" class="${styles.btn}">try again</button>
        </div>
    </div>
</div>
`;

document.querySelector("body")?.insertAdjacentHTML("afterbegin", html);

const htmlNode = <HTMLElement>document.querySelector(`.${styles.container}`);

const rephraseBtn = <HTMLButtonElement>htmlNode.querySelector("button");
const rephraseSelect = <HTMLSelectElement>htmlNode.querySelector("select");
const content = <HTMLDivElement>htmlNode.querySelector(`.${styles.content}`);
const contentParagraph = <HTMLParagraphElement>content.querySelector("p");

// const acceptButton = <HTMLButtonElement>content.querySelector("#accept");
// const discardButton = <HTMLButtonElement>content.querySelector("#discard");

document.addEventListener("click", event => {
    // COMMENT typescript forcing as Node in event.target
    if (htmlNode.contains(event.target as Node) || selection?.type === "Range") {
        return;
    }

    htmlNode.style.display = "none";
    content.style.display = "none";
    contentParagraph.innerHTML = "";
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
        console.log(clonedRange);
    }, 500);
});

rephraseBtn?.addEventListener("click", async () => {
    if (selection === null) {
        return;
    }

    try {
        const result = await rephrase(clonedRange.toString(), rephraseSelect.value);

        content.style.display = "block";
        contentParagraph.innerHTML = "";

        for await (const chunk of result.stream) {
            const text = chunk.text();

            const spanElement = document.createElement("span");
            spanElement.textContent = text;
            contentParagraph.insertAdjacentElement("beforeend", spanElement);
        }
    } catch (e) {
        content.style.display = "block";
        content.textContent = "Oops ! something went wrong.";
    }
});
