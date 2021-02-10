
class VideoManager
{
    currentVideo;
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
        // this.currentVideo.destroy();
        this.currentVideo = video;
    }
    getCurrentTime()
    {
        return this.currentVideo.getCurrentTime();
    }
}
module.exports = VideoManager;