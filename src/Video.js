class Video
{
    url;
    type;
    title;

    fromUrl(url)
    {
        console.log(url);
        var youtube_video = /^(https?\:\/\/)?(www\.youtube\.com\/|www\.youtube\.com\/watch\?v=|youtu\.be\/).{11}$/;
        var youtube_playlist = /^(https?\:\/\/)?(www\.youtube\.com\/)(playlist\?list=|watch\?v=.{11}&list=).+(&index=)?/;
        if(youtube_video.test(url))
        {
            console.log("is youtube vid!");
        }
        else if(youtube_playlist.test(url))
        {
            console.log("is youtube playlist!");
        }
        return this();
    }
}
module.exports = Video;