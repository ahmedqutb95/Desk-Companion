document.getElementById("sendBtn").addEventListener("click", () => {

    const message = createDisplayTextMessage(
        document.getElementById("textInput").value
    );

    console.log(message);

});