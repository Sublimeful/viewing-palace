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
        this.state = -1;
        this.player.on("stateChange", (event) => {
            switch (event.data) {
                case -1:
                    break;
                case 0:
                    break;
                case 1:
                    if(this.state == 2)
                        // Client unpaused video
                        this.socket.emit("unpause");
                    else if(this.state == -1)
                    {
                        // Client first started watching
                    }
                    break;
                case 2:
                    if (this.state == 1)
                        // Client paused video
                        this.socket.emit("pause");
                    break;
                case 3:
                    break;
                case 5:
                    break;
            }
            this.state = event.data;
        });
        this.player.playVideo();
    }
    pause() {
        this.player.pauseVideo();
    }
    unpause()
    {
        this.player.playVideo();
    }
}

module.exports = YouTube;
