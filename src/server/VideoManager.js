import YouTube from "./players/YouTube.js";
import Timer from "./Timer.js";
class VideoManager {
    constructor(io)
    {
        this.io = io;
        this.queue = [];
        this.currentPlaying = null;
        this.timer = new Timer();
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
            if(video.equals(this.queue[i]))
                return i;
        }
        return -1;
    }
    //loads a video for a user if there is one
    loadVideo(socket) {
        if (this.currentPlaying != null)
            socket.emit("play", {video: this.currentPlaying});
        socket.emit("enqueueAll", {videos: this.queue});
    }
    //loads a new video for all users
    playNew(video) {
        this.timer.resetTimer();
        this.currentPlaying = video;
        this.io.emit("play", {video: video});
    }
    newVideoStarted()
    {
        var videoEndedChecker = setInterval(() => {
            if (this.currentPlaying != null && 
                this.timer.getCurrentTime() > this.currentPlaying.duration - 1000) {
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
    //queues up a video, playnew if no video is on
    enqueue(userInput) {
        const matchYouTubeVideo = /^(https?\:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtube\.com\/|youtu\.be\/).{11}/;
        const matchYouTubePlaylist = /^(https?\:\/\/)?(www\.)?(youtube\.com\/playlist\?list=).+/;

        if (matchYouTubeVideo.test(userInput)) {
            const request = YouTube.requestData(userInput);
            request
                .then((video) => {
                    var duplicateVid = false;
                    this.queue.forEach(otherVid => {
                        if(video.equals(otherVid))
                        {
                            duplicateVid = true;
                            return;
                        }
                    });
                    if(!duplicateVid)
                    {
                        this.queue.push(video);
                        this.io.emit("enqueue", {video: video});
                        if (this.currentPlaying == null) this.playNew(video);
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
export default VideoManager;
