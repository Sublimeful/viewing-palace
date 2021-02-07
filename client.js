const io = require("socket.io-client");
const socket = io.connect("http://localhost:8080/")
const input = document.querySelector("#video-add-input");

input.addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
        event.preventDefault();
        socket.emit("add_video", {input: input.value})
        input.value = "";
    }
})



















































