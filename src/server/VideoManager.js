import YouTube from "./players/YouTube.js";
import Timer from "./players/Timer.js";
class VideoManager {
    static queue = [];
    static currentPlaying = null;
    static io;
    static timer = new Timer();
    static loadVideo(socket) {
        if (this.currentPlaying != null) socket.emit("play", this.currentPlaying);
    }
    static play(video) {
        this.io.emit("play", video);
        this.currentPlaying = video;
        timer.resetTimer();
        timer.startTimer();
    }
    static unpause(socket) {
        socket.broadcast.emit("unpause");
        timer.startTimer();
    }
    static pause(socket) {
        socket.broadcast.emit("pause");
        timer.pauseTimer();
    }
    static enqueue(userInput) {
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
                    if (this.currentPlaying == null) this.play(video);
                })
                .catch((err) => {
                    console.error(err);
                });
        }
    }
}
export default VideoManager;
