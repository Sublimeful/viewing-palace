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
    //loads a video for a user if there is one
    loadVideo(socket) {
        if (this.currentPlaying != null)
            socket.emit("play", {video: this.currentPlaying});
    }
    //loads a new video for all users
    playNew(video) {
        this.io.emit("play", {video: video});
        this.currentPlaying = video;
        this.timer.resetTimer();
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
        var matchYouTubeVideo = /^(https?\:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtube\.com\/|youtu\.be\/).{11}/;
        var matchYouTubePlaylist = /^(https?\:\/\/)?(www\.)?(youtube\.com\/playlist\?list=).+/;
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
                    if (this.currentPlaying == null) this.playNew(video);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
export default VideoManager;
