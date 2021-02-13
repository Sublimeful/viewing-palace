import YouTube from "./players/YouTube.js";
import Raw from "./players/Raw.js";
import Timer from "./Timer.js";
class VideoManager {
    constructor(io) {
        this.io = io;
        this.queue = [];
        this.currentPlaying = null;
        this.timer = new Timer();
        this.maxResults = 10;
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
    //loads a video for a user if there is one
    loadVideo(socket) {
        if (this.currentPlaying != null)
            socket.emit("play", { video: this.currentPlaying });
        socket.emit("enqueue", { videos: this.queue });
    }
    //loads a new video for all users
    playNew(video) {
        this.timer.resetTimer();
        this.currentPlaying = video;
        this.io.emit("play", { video: video });
    }
    newVideoStarted() {
        if (
            this.currentPlaying != null &&
            this.currentPlaying.isLivestream == true
        )
            return;
        this.timer.startTimer();
        var videoEndedChecker = setInterval(() => {
            if (
                this.currentPlaying != null &&
                this.timer.getCurrentTime() >
                    this.currentPlaying.duration - 1000
            ) {
                console.log("Video playback has ended!");
                const videoIndex = this.findIndex(this.currentPlaying);
                this.currentPlaying = null;
                if (videoIndex + 1 < this.queue.length) {
                    this.playNew(this.queue[videoIndex + 1]);
                }
                clearInterval(videoEndedChecker);
            }
        }, 1000);
    }
    unpause(socket) {
        socket.broadcast.emit("unpause");
        this.timer.unpauseTimer();
    }
    pause(socket) {
        socket.broadcast.emit("pause");
        this.timer.pauseTimer();
    }
    move(videoIndex, newIndex) {
        if (
            newIndex >= 0 &&
            newIndex < this.queue.length &&
            videoIndex != newIndex
        ) {
            const tempVideo = this.queue[videoIndex];
            this.queue[videoIndex] = this.queue[newIndex];
            this.queue[newIndex] = tempVideo;
            this.io.emit("move", { moveInfo: [videoIndex, newIndex] });
        }
    }
    //removes video
    dequeue(video) {
        this.queue.splice(this.findIndex(video), 1);
        this.io.emit("dequeue", { video: video });
        if (this.isEqual(video, this.currentPlaying)) {
            const videoIndex = this.findIndex(this.currentPlaying);
            this.currentPlaying = null;
            if (videoIndex + 1 < this.queue.length) {
                this.playNew(this.queue[videoIndex + 1]);
            }
        }
    }
    enqueue(video) {
        // var duplicateVid = false; <------------------------------ Enable Duplicate videos
        // this.queue.forEach((otherVid) => {
        //     if (this.isEqual(video, otherVid)) {
        //         duplicateVid = true;
        //         return;
        //     }
        // });
        // if (!duplicateVid) {
        this.queue.push(video);
        this.io.emit("enqueue", { videos: [video] });
        if (this.currentPlaying == null) this.playNew(video);
        // }
    }

    //queues up a video, playnew if no video is on
    parseInput(userInput, title) {
        const matchYouTubeVideo = /^(https?\:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtube\.com\/|youtu\.be\/)[A-z0-9_-]{11}/;
        const matchYouTubePlaylist = /^(https?\:\/\/)?(www\.)?(youtube\.com\/playlist\?list=)[A-z0-9_-]+/;

        if (matchYouTubeVideo.test(userInput)) {
            const request = YouTube.requestVideoData(userInput);
            request
                .then((video) => {
                    if (title) video.title = title;
                    this.enqueue(video);
                })
                .catch((err) => console.error(err));
        } else if (matchYouTubePlaylist.test(userInput)) {
            YouTube.enqueuePlaylist(userInput, this.maxResults, this);
        } else {
            //is RAW
            const request = Raw.requestVideoData(userInput);
            request
                .then((video) => {
                    if (title) video.title = title;
                    this.enqueue(video);
                })
                .catch((err) => console.error(err));
        }
    }
}
export default VideoManager;
