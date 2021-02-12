const { ResizeSensor } = require("css-element-queries");
const YouTube = require("./players/YouTube.js");

class VideoManager
{
    queue = [];
    elemQueue = [];
    queueElem = document.getElementById("playlist");
    currentVideo;
    socket;
    resizeSensor = new ResizeSensor(document.querySelector("section#player"), () => {
        if(this.currentVideo != null)
            this.currentVideo.resize();
    });
    constructor(socket)
    {
        this.socket = socket;
    }
    isEqual(video, other) {
        if(video == null || other == null) return false;
        if (video.type == "YouTube" && other.type == "YouTube") {
            return (
                video.duration == other.duration &&
                video.id == other.id &&
                video.title == other.title
            );
        } else if (video.type == "Raw" && other.type == "Raw") {
            return (
                video.duration == other.duration &&
                video.contentType == other.contentType &&
                video.url == other.url
            );
        } else return false;
    }
    /**
     * uses video equals method to get index of video
     * 
     * returns -1 if not found at all (for some reason)
     */
    findIndex(video)
    {
        for(var i = 0; i < this.queue.length; ++i)
        {
            if(this.isEqual(video, this.queue[i]))
                return i;
        }
        return -1;
    }
    seekTo(time)
    {
        this.currentVideo.seekTo(time);
    }
    pause()
    {
        this.currentVideo.pause();
    }
    unpause()
    {
        this.currentVideo.unpause();
    }
    playNew(video)
    {
        if(this.currentVideo != null)
            this.currentVideo.destroy();
        if(video.type == "YouTube")
        {
            this.currentVideo = new YouTube(video, socket);
        }
        else // is RAW
        {
            this.currentVideo = new Raw(video, socket);
        }
    }
    getCurrentTime()
    {
        if(this.currentVideo != null)
            return this.currentVideo.getCurrentTime();
    }
    dequeue(video)
    {
        const index = this.findIndex(video);
        this.queue.splice(index, 1); 
        this.elemQueue.splice(index, 1)[0].remove();
    }
    enqueue(videos)
    {
        videos.forEach(video => {
            const queueItem = document.createElement("div");
            queueItem.className = "playlist-video";
            const durationLabel = document.createElement("h1");
            durationLabel.textContent = video.duration;
            const titleLabel = document.createElement("h1");
            titleLabel.textContent = video.title;
            const delButton = document.createElement("button");
            this.queueElem.appendChild(queueItem);
            queueItem.appendChild(durationLabel);
            queueItem.appendChild(titleLabel);
            queueItem.appendChild(delButton);
            this.elemQueue.push(queueItem);
            this.queue.push(video);
            delButton.addEventListener("click", () => {
                this.socket.emit("dequeue", {video: video});
            })
        })
    }
}
module.exports = VideoManager;