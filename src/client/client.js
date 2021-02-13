const connect = require("socket.io-client");
const socket = connect();
const addVideoInput = document.querySelector("#video-add-input");
const addVideoTitle = document.querySelector("#video-add-title");
const signInInput = document.querySelector("#sign-in");
const leaderButton = document.querySelector("#leader-btn");
const VideoManager = require("./VideoManager.js");

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
        socket.emit("enqueue", { input: addVideoInput.value, title: addVideoTitle.value });
        addVideoInput.value = "";
    }
});

var videoManager = new VideoManager(socket);
socket.on("play", (data) => {
    videoManager.playNew(data.video);
});
socket.on("pause", () => {
    videoManager.pause();
});
socket.on("unpause", () => {
    videoManager.unpause();
});
socket.on("sync", (data) => {
    videoManager.sync(data.currentTime);
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
socket.on("dequeue", (data) => {
    videoManager.dequeue(data.video);
})