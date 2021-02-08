const Youtube = require("./players/Youtube");
class VideoManager
{
    static queue = [];
    static currentPlaying = null;
    static play(video)
    {
        switch(video.type)
        {
            case "Youtube":
                
                break;
        }
    }
    static checkCurrentPlaying()
    {
        if(this.currentPlaying == null)
        {
            play(queue[0]);
        }
    }
    static enqueue(userInput)
    {
        var matchYoutubeVideo = /^(https?\:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtube\.com\/|youtu\.be\/)[a-zA-Z0-9]{11}/;
        var matchYoutubePlaylist = /^(https?\:\/\/)?(www\.)?(youtube\.com\/playlist\?list=).+/;
        if(matchYoutubeVideo.test(userInput))
        {
            const id = Youtube.getId(userInput);
            this.queue.forEach(video => {
                if(video.id == id)
                {
                    console.error("video already in queue");
                    return -1;
                }
            })
            const request = Youtube.requestData(userInput);
            request.then((videoData) => {
                this.queue.push(videoData);
            })
            .catch((err) => {
                console.error(err);
            })
        }
        else if(matchYoutubePlaylist.test(userInput))
        {
        }
        else
        {
        }
    }
}
module.exports = VideoManager;