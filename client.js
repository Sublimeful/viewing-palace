const connect = require("socket.io-client");
const socket = connect("http://localhost:8080/")
const addVideoInput = document.querySelector("#video-add-input");

addVideoInput.addEventListener("keyup", (event) => {
    if(event.keyCode === 13) {
        event.preventDefault();
        socket.emit("addVideo", {input: input.value})
        input.value = "";
    }
})



















































