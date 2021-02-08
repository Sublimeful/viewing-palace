const Youtube = require("./players/Youtube");
class VideoManager
{
    queue = [];
    enQueue(url)
    {
        var youtube_video = /^(https?\:\/\/)?(www.)?(youtube\.com\/watch\?v=|youtube\.com\/|youtu\.be\/)[a-zA-Z0-9]{11}/;
        var youtube_playlist = /^(https?\:\/\/)?(www\.)?(youtube\.com\/playlist\?list=).+/;
        if(youtube_video.test(url))
        {
            Youtube.from_url(url)
            .then(res => res.json())
            .then(json => {
                if(json.items[0] == null)
                {
                    res = null;
                    return;
                }
                const item = json.items[0];
                this.queue.push(new Youtube(id, item.snippet.title, item.contentDetails.duration));
            })
            .catch(err => {
                console.error(err);
            })
        }
        else if(youtube_playlist.test(url))
        {
        }
        else
        {
        }
    }
}
module.exports = VideoManager;