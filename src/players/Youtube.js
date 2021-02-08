const fetch = require("node-fetch");
class Youtube
{
    static get_id(url)
    {
        if(url.includes("youtube.com/watch?v="))
        {
            var i = url.indexOf("youtube.com/watch?v=");
            return url.substring(i + 20, i + 20 + 11);
        }
        else if(url.includes("youtube.com/"))
        {
            var i = url.indexOf("youtube.com/");
            return url.substring(i + 12, i + 12 + 11);
        }
        else if(url.includes("youtu.be/"))
        {
            var i = url.indexOf("youtu.be/");
            return url.substring(i + 9, i + 9 + 11);
        }
    }
    constructor(id, duration, title)
    {
        this.id = id;
        this.duration = duration;
        this.title = title;
        console.log(title)
        console.log(duration)
    }
        
    static from_url(url)
    {
        const id = Youtube.get_id(url);
        const api_key = "AIzaSyDTk1OPRI9cDkAK_BKsBcv10DQCHse-QaA";
        const fetch_url = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&fields=items(snippet/title,contentDetails/duration)&id=${id}&key=${api_key}`
        return fetch(fetch_url);
    }

}
module.exports = Youtube;