import "./ui.js";
import { createDisplayTextMessage } from "./protocol.js";

import { connect, send } from "./websocket.js";

console.log("app.js loaded");

const sendBtn = document.getElementById("sendBtn");
const textInput = document.getElementById("textInput");
const consoleBox = document.getElementById("console");

const connectBtn = document.getElementById("connectBtn");
const ipInput = document.getElementById("ipInput");

connectBtn.addEventListener("click", () => {
    connect(ipInput.value);
});

sendBtn.addEventListener("click", () => {

    const message = createDisplayTextMessage(textInput.value);

    // Browser console
    send(message);

    // Dashboard console
    consoleBox.innerHTML += `
        <div>Sent: ${JSON.stringify(message)}</div>
    `;

});
