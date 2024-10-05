import { rephrase } from "../utils/ai-script";
import * as styles from "./index.module.css";
import RephraseSVG from "../assets/svg/rephrase.svg";
import CaretSVG from "../assets/svg/caret.svg";
import SpellingSVG from "../assets/svg/spelling.svg";

const selection = getSelection();
let prevSelectedText = "";

const rephraseTones = ["formal", "convince", "normal", "angry"];

const html = `
<div class="${styles.container}">
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
    <button class="${styles.btn}">fix autograph
    ${SpellingSVG}
    </button>
</div>
`;

document.querySelector("body")?.insertAdjacentHTML("afterbegin", html);

const htmlNode = document.querySelector(`.${styles.container}`) as HTMLElement;
console.log("parent element", htmlNode);

const rephraseBtn = <HTMLButtonElement>htmlNode.querySelector("button");
const rephraseSelect = <HTMLSelectElement>htmlNode.querySelector("select");

document.addEventListener("mouseup", () => {
    if (selection?.type !== "Range") {
        console.log("nothing to select");
        htmlNode.style.display = "none";
        return;
    }

    const range = selection.getRangeAt(0);

    if (prevSelectedText === range.toString()) {
        return;
    }

    const { bottom: offsetY, left: offsetX } = range.getBoundingClientRect();

    htmlNode.style.display = "flex";
    htmlNode.style.top = `${offsetY + window.scrollY + 10}px`;
    htmlNode.style.left = `${offsetX}px`;

    prevSelectedText = range.toString();
});

rephraseBtn?.addEventListener("click", async () => {
    if (selection === null) {
        return;
    }

    const parentElement = selection.anchorNode?.parentElement;
    const result = await rephrase(selection.toString(), rephraseSelect.value);
    // htmlNode.style.display = "none";

    let textString = "";
    for await (const chunk of result.stream) {
        const text = chunk.text();
        console.log(text);
        textString += text;
        // range.insertNode(document.createTextNode(textString));

        if (parentElement) {
            parentElement.textContent = textString;
        }
    }

    // selection.removeAllRanges();
});
