const YouTubePlayer = require("youtube-player");

class YouTube {
    constructor(id, socket) {
        this.socket = socket;
        this.id = id;
        this.playerElem = document.getElementById("player");
        this.playerContainer = document.createElement("div");
        this.playerContainer.id = "video-player";
        this.playerElem.appendChild(this.playerContainer);
        this.player = YouTubePlayer("video-player", {
            height: this.playerElem.clientHeight,
            width: this.playerElem.clientWidth,
        });
        this.player.loadVideoById(this.id);
        this.state = this.player.getPlayerState();
        this.player.on("stateChange", (event) => {
            console.log("from: " + this.state);
            console.log("to: " + event.data);
            switch (event.data) {
                case -1:
                    break;
                case 0:
                    break;
                case 1:
                    if(this.state == 2)
                        // Client unpaused video
                        this.socket.emit("unpause");
                    break;
                case 2:
                    if (this.state == 1)
                        // Client paused video
                        this.socket.emit("pause");
                    break;
                case 3:
                    if(this.state == -1)
                        // Client who requested video got video loaded
                        this.socket.emit("sync");
                    break;
                case 5:
                    break;
            }
            this.state = event.data;
        });
        this.player.playVideo();
        this.syncer = setInterval(() => {
            if(this.state == 1)
            {
                this.player.getCurrentTime().then(time => {
                    this.socket.emit("sync", {currentTime: time});
                })
            }
        }, 100)
    }
    pause() {
        this.player.pauseVideo();
    }
    unpause()
    {
        this.player.playVideo();
    }
    seekTo(time)
    {
        this.player.seekTo(time/1000, true);
    }
    getCurrentTime()
    {
        return this.player.getCurrentTime();
    }
    resize()
    {
        this.player.setSize(this.playerElem.clientWidth, this.playerElem.clientHeight);
    }
    destroy()
    {
        console.log("DESTROY")
        this.player.destroy();
    }
}

module.exports = YouTube;
