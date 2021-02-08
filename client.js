import connect from "socket.io-client";
import YouTubePlayer from "youtube-player";
const socket = connect("http://localhost:8080/");
const addVideoInput = document.querySelector("#video-add-input");
const currentVideo;
const playerElem = document.getElementById("player");

socket.on("play", (video) => {
    currentVideo = video;
    playerElem.appendChild((document.createElement("div").id = "video-player"));
    const player = YouTubePlayer("video-player");
    player.loadVideoById(video.id);
    player.playVideo();
});

addVideoInput.addEventListener("keyup", (event) => {
    if (event.keyCode === 13) {
        event.preventDefault();
        socket.emit("addVideo", { input: addVideoInput.value });
        addVideoInput.value = "";
    }
});
