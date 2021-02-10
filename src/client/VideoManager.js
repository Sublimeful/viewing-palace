
class VideoManager
{
    currentVideo;
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
}
module.exports = VideoManager;