class Raw {
    constructor(video, socket) {
        this.socket = socket;
        this.data = video;
        this.playerElem = document.getElementById("player");
        this.isVideo = false;
        if (this.data.contentType == "video/mp4") this.isVideo = true;
        this.player = document.createElement("video");
        this.player.setAttribute("controls", "");
        this.player.setAttribute("autoplay", "");
        this.player.setAttribute("height", this.playerElem.clientHeight);
        this.player.setAttribute("width", this.playerElem.clientWidth);
        this.player.id = "video-player";
        this.playerElem.appendChild(this.player);
        this.player.src = this.data.url;
        this.player.ontimeupdate = () => {
            this.socket.emit("sync", {currentTime: this.player.currentTime});
        }
        this.player.onpause = () => {
            this.socket.emit("pause");
        }
        this.player.play = () => {
            this.socket.emit("play");
        }
    }
    seekTo(time)
    {
        this.player.currentTime = time/1000;
    }
    resize() {
        if (this.isVideo) {
            this.player.setAttribute("height", this.playerElem.clientHeight);
            this.player.setAttribute("width", this.playerElem.clientWidth);
        }
    }
    destroy() {
        this.player.remove();
    }
}
module.exports = Raw;
