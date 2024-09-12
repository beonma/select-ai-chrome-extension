const selection = getSelection();

const html = `
<div class="i1U2I__container">
    <button>rephrase me</button>
</div>
`;

document.querySelector("body").insertAdjacentHTML("afterbegin", html);

const htmlNode = document.querySelector(".i1U2I__container");

document.addEventListener("mouseup", () => {
    if (selection.type !== "Range") {
        console.log("nothing to select");

        return;
    }

    const range = selection.getRangeAt(0);

    console.log(range.toString());
    const { bottom: offsetY, left: offsetX } = range.getBoundingClientRect();

    htmlNode.style.top = `${offsetY + window.scrollY + 10}px`;
    htmlNode.style.left = `${offsetX}px`;
});
