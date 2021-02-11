const { ResizeSensor } = require("css-element-queries");

class VideoManager
{
    queue = [];
    queueElem = document.getElementById("playlist");
    currentVideo;
    resizeSensor = new ResizeSensor(document.querySelector("section#player"), () => {
        if(this.currentVideo != null)
            this.currentVideo.resize();
    });
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
        this.currentVideo = video;
    }
    getCurrentTime()
    {
        if(this.currentVideo != null)
            return this.currentVideo.getCurrentTime();
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
            this.queueElem.appendChild(queueItem);
            queueItem.appendChild(durationLabel);
            queueItem.appendChild(titleLabel);
            this.queue.push(queueItem);
        })
    }
}
module.exports = VideoManager;