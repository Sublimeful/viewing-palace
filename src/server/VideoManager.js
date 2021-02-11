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
            const id = YouTube.getId(userInput);
            this.queue.forEach((video) => {
                if (video.id == id) {
                    console.error("video already in queue");
                    return -1;
                }
            });
            const request = YouTube.requestData(userInput);
            request
                .then((video) => {
                    this.queue.push(video);
                    this.io.emit("enqueue", {video: video});
                    if (this.currentPlaying == null) this.playNew(video);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
export default VideoManager;
