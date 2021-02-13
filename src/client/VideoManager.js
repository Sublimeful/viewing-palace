const { ResizeSensor } = require("css-element-queries");
const YouTube = require("./players/YouTube.js");
const Raw = require("./players/Raw.js");

class VideoManager {
    queue = [];
    elemQueue = [];
    queueElem = document.getElementById("playlist");
    currentVideo;
    socket;
    syncThreshold = 1000;
    videoType;
    resizeSensor = new ResizeSensor(
        document.querySelector("section#player"),
        () => {
            if (this.currentVideo != null) this.currentVideo.resize();
        }
    );
    constructor(socket) {
        this.socket = socket;
    }
    isEqual(video, other) {
        if (video == null || other == null) return false;
        if (video.type == "YouTube" && other.type == "YouTube") {
            return video.duration == other.duration && video.id == other.id;
        } else if (video.type == "Raw" && other.type == "Raw") {
            return (
                video.contentType == other.contentType && video.url == other.url
            );
        } else return false;
    }
    /**
     * uses video equals method to get index of video
     *
     * returns -1 if not found at all (for some reason)
     */
    findIndex(video) {
        for (var i = 0; i < this.queue.length; ++i) {
            if (this.isEqual(video, this.queue[i])) return i;
        }
        return -1;
    }
    seekTo(time) {
        this.currentVideo.seekTo(time);
    }
    pause() {
        this.currentVideo.pause();
    }
    unpause() {
        this.currentVideo.unpause();
    }
    playNew(video) {
        if (video.type == "YouTube") {
            if (this.currentVideo != null && this.currentVideo.type == "YouTube")
                this.currentVideo.player.loadVideoById(video.id);
            else {
                if (this.currentVideo != null) this.currentVideo.destroy();
                this.currentVideo = new YouTube(video, this.socket);
            }
        } // is RAW
        else {
            if (this.currentVideo != null && this.currentVideo.type == "Raw") {
                this.currentVideo.player.src = video.url;
                this.currentVideo.player.load();
                this.currentVideo.player.play();
            } else {
                if (this.currentVideo != null) this.currentVideo.destroy();
                this.currentVideo = new Raw(video, this.socket);
            }
        }
    }
    getCurrentTime() {
        if (this.currentVideo != null)
            return this.currentVideo.getCurrentTime();
    }
    dequeue(video) {
        const index = this.findIndex(video);
        this.queue.splice(index, 1);
        this.elemQueue.splice(index, 1)[0].remove();
    }
    sync(syncTime) {
        if (this.currentVideo == null) return;
        this.getCurrentTime().then((currentTime) => {
            if (Math.abs(syncTime - currentTime * 1000) >= this.syncThreshold)
                this.seekTo(syncTime);
        });
    }
    move(videoIndex, newIndex) {
        if (
            newIndex >= 0 &&
            newIndex < this.queue.length &&
            videoIndex != newIndex
        ) {
            if (newIndex > videoIndex)
                this.queueElem.insertBefore(
                    this.queueElem.children[videoIndex],
                    this.queueElem.children[newIndex].nextSibling
                );
            else
                this.queueElem.insertBefore(
                    this.queueElem.children[newIndex],
                    this.queueElem.children[videoIndex].nextSibling
                );
            const tempVideo = this.queue[videoIndex];
            this.queue[videoIndex] = this.queue[newIndex];
            this.queue[newIndex] = tempVideo;
        }
    }
    enqueue(videos) {
        videos.forEach((video) => {
            const queueItem = document.createElement("div");
            queueItem.className = "playlist-video";
            const durationLabel = document.createElement("h1");
            const hours = Math.floor(video.duration / 1000 / 60 / 60);
            const minutes = Math.floor((video.duration / 1000 / 60) % 60);
            const seconds = (video.duration / 1000) % 60;
            durationLabel.textContent +=
                hours > 0 ? (hours >= 10 ? hours : "0" + hours) + ":" : "";
            durationLabel.textContent +=
                (minutes >= 10 ? minutes : "0" + minutes) + ":";
            durationLabel.textContent +=
                seconds >= 10 ? seconds : "0" + seconds;
            const titleLabel = document.createElement("h1");
            titleLabel.textContent = video.title;
            const delButton = document.createElement("button");
            delButton.textContent = "X";

            const playNowButton = document.createElement("button");
            var svg = document.createElement("img");
            svg.src = "/svg/play-button.svg";
            svg.style.width = "50%";
            playNowButton.style.padding = "4px 0 0 3px";
            playNowButton.appendChild(svg);

            const moveDownButton = document.createElement("button");
            var svg = document.createElement("img");
            svg.src = "/svg/down-arrow.svg";
            moveDownButton.style.paddingTop = "5px";
            moveDownButton.appendChild(svg);

            const moveUpButton = document.createElement("button");
            var svg = document.createElement("img");
            svg.src = "/svg/up-arrow.svg";
            moveUpButton.appendChild(svg);

            this.queueElem.appendChild(queueItem);
            queueItem.appendChild(durationLabel);
            queueItem.appendChild(titleLabel);
            queueItem.appendChild(delButton);
            queueItem.appendChild(playNowButton);
            queueItem.appendChild(moveDownButton);
            queueItem.appendChild(moveUpButton);
            this.elemQueue.push(queueItem);
            this.queue.push(video);
            delButton.addEventListener("click", () => {
                this.socket.emit("dequeue", { video: video });
            });
            playNowButton.addEventListener("click", () => {
                this.socket.emit("playNow", { video: video });
            });
            moveDownButton.addEventListener("click", () => {
                const index = this.findIndex(video);
                this.socket.emit("move", { moveInfo: [index, index + 1] });
            });
            moveUpButton.addEventListener("click", () => {
                const index = this.findIndex(video);
                this.socket.emit("move", { moveInfo: [index, index - 1] });
            });
        });
    }
}
module.exports = VideoManager;
