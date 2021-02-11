const connect = require("socket.io-client");
const socket = connect("http://localhost:8080/");
const addVideoInput = document.querySelector("#video-add-input");
const signInInput = document.querySelector("#sign-in");
const leaderButton = document.querySelector("#leader-btn");
const VideoManager = require("./VideoManager.js");
const YouTube = require("./players/YouTube.js");

leaderButton.addEventListener("click", () => {
    socket.emit("leaderButtonPressed");
});

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
var syncThreshold = 1000;
socket.on("play", (data) => {
    if(videoManager.currentVideo != null)
        videoManager.currentVideo.destroy();
    switch (data.video.type) {
        case "YouTube":
            videoManager.playNew(new YouTube(data.video.id, socket));
            break;
    }
});
socket.on("pause", () => {
    videoManager.pause();
});
socket.on("unpause", () => {
    videoManager.unpause();
});
socket.on("sync", (data) => {
    videoManager.getCurrentTime().then((currentTime) => {
        if (Math.abs(data.currentTime - currentTime * 1000) >= syncThreshold) {
            videoManager.seekTo(data.currentTime);
            console.log("%cSYNCED!", "color: red");
        }
    });
});
socket.on("leadered", () => {
    leaderButton.style.backgroundColor = "green";
});
socket.on("unleadered", () => {
    leaderButton.style.backgroundColor = "";
});
socket.on("enqueue", (data) => {
    videoManager.enqueue([data.video]);
});
socket.on("enqueueAll", (data) => {
    videoManager.enqueue(data.videos);
})
