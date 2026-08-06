console.log("ui.js loaded");

const textInput = document.getElementById("textInput");
const preview = document.getElementById("preview");

console.log(textInput);
console.log(preview);

textInput.addEventListener("input", (e) => {
    console.log("Typing:", e.target.value);

    console.log(preview); // Add this

    preview.innerText = e.target.value || "Hello";
});