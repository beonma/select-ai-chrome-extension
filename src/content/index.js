import * as styles from "./index.module.css";

console.log(styles);

const selection = getSelection();
let prevSelectedText = "";

const html = `
<div class="${styles.container}">
    <button>rephrase</button>
    <select id="rephrase-tone">
        <option value="formal">formal</option>
        <option value="convince">convince</option>
        <option value="normal">normal</option>
        <option value="angry">angry</option>
    </select>
</div>
`;

document.querySelector("body").insertAdjacentHTML("afterbegin", html);

const htmlNode = document.querySelector(`.${styles.container}`);
console.log("parent element", htmlNode);

const rephraseBtn = htmlNode.querySelector("button");
const rephraseSelect = htmlNode.querySelector("select");

document.addEventListener("mouseup", () => {
    if (selection.type !== "Range") {
        console.log("nothing to select");
        htmlNode.style.display = "none";
        return;
    }

    const range = selection.getRangeAt(0);

    if (prevSelectedText === range.toString()) {
        return;
    }

    console.log(range.toString());
    const { bottom: offsetY, left: offsetX } = range.getBoundingClientRect();

    htmlNode.style.display = "block";
    htmlNode.style.top = `${offsetY + window.scrollY + 10}px`;
    htmlNode.style.left = `${offsetX}px`;

    prevSelectedText = range.toString();
});

rephraseBtn.addEventListener("click", () => {
    console.log(rephraseSelect.value);
});
