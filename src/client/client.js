const connect = require("socket.io-client");
const socket = connect("http://localhost:8080/");
const addVideoInput = document.querySelector("#video-add-input");
const signInInput = document.querySelector("#sign-in");
const VideoManager = require("./VideoManager.js");
const YouTube = require("./players/YouTube.js")

signInInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        if (signInInput.value.trim() != "") {
            socket.emit("signIn", { username: signInInput.value });
            signInInput.value = "";
            signInInput.style.display = "none";
        }
    }
});

addVideoInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        socket.emit("addVideo", { input: addVideoInput.value });
        addVideoInput.value = "";
    }
});

var videoManager = new VideoManager();
socket.on("play", (data) => {
    switch(data.video.type)
    {
        case "YouTube":
            console.log(data.video.id)
            videoManager.playNew(new YouTube(data.video.id, socket));
            break;
    }
});
socket.on("pause", () => {
    videoManager.pause();
})
