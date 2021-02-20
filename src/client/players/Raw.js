class Raw {
    constructor(video, socket, videoManager) {
        this.type = "Raw";
        this.socket = socket;
        this.playerElem = document.getElementById("player");
        this.player = document.createElement("video");
        this.playerElem.appendChild(this.player);
        this.player.setAttribute("controls", "");
        this.player.setAttribute("autoplay", "");
        this.player.setAttribute("height", this.playerElem.clientHeight);
        this.player.setAttribute("width", this.playerElem.clientWidth);
        this.player.id = "video-player";
        this.player.src = video.url;
        this.player.oncanplay = () => {
            this.player.play();
            this.player.ontimeupdate = () => {
                this.socket.emit("sync", { currentTime: this.player.currentTime * 1000, duration: this.player.duration * 1000 });
            };
            this.player.onpause = () => {
                this.socket.emit("pause");
            };
            this.player.play = () => {
                this.socket.emit("unpause");
            };
            this.player.onended = () => {
                this.socket.emit("videoEnded");
            }
            videoManager.updateRaw(video, this.player.duration);
        }
    }
    pause() {
        this.player.pause();
    }
    unpause() {
        this.player.play();
    }
    seekTo(time) {
        this.player.currentTime = time / 1000;
    }
    resize() {
        this.player.setAttribute("height", this.playerElem.clientHeight);
        this.player.setAttribute("width", this.playerElem.clientWidth);
    }
    destroy() {
        this.player.remove();
    }
    getCurrentTime()
    {
        return new Promise((resolve, _) => {
            resolve(this.player.currentTime);
        })
    }
}
module.exports = Raw;
