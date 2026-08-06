let socket = null;

export function connect(ip) {

    socket = new WebSocket(`ws://${ip}:81`);

    socket.onopen = () => {
        console.log("Connected");
    };

    socket.onclose = () => {
        console.log("Disconnected");
    };

    socket.onmessage = (event) => {
        console.log("Received:", event.data);
    };
}

export function send(message) {

    if (!socket || socket.readyState !== WebSocket.OPEN) {
        alert("Not connected to ESP32");
        return;
    }

    socket.send(JSON.stringify(message));
}