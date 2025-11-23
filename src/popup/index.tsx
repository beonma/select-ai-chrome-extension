import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import TRIAL_TOKENS from "@src/trial_tokens.json";

document.addEventListener("DOMContentLoaded", () => {
    TRIAL_TOKENS.forEach(obj => {
        const otMeta = document.createElement("meta");
        otMeta.httpEquiv = "origin-trial";
        otMeta.content = obj.token;
        document.head.append(otMeta);
    });
});

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLDivElement);

root.render(<App />);
