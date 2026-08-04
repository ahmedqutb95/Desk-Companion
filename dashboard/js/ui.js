const textInput = document.getElementById("textInput");
const preview = document.getElementById("preview");

textInput.addEventListener("input", () => {
    preview.textContent = textInput.value || "Hello";
});