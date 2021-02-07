const Video = require("./Video");
class VideoManager
{
    queue = [];
    enQueue(url)
    {
        var vid = Video.fromurl(url);
        return true;
    }
}
module.exports = VideoManager;