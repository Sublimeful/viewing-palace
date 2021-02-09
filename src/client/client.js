const connect = require("socket.io-client");
const YouTube = require("./players/YouTube.js")
const socket = connect("http://localhost:8080/");
const addVideoInput = document.querySelector("#video-add-input");
var currentVideo;

socket.on("play", (video) => {
    currentVideo = new YouTube(video.id, socket);
});

socket.on("unpause", (data) => {
    currentVideo.unpause();
})

socket.on("pause", (data) => {
    currentVideo.pause();
})

addVideoInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        socket.emit("addVideo", { input: addVideoInput.value });
        addVideoInput.value = "";
    }
});
