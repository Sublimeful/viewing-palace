import fetch from 'node-fetch'
class Youtube
{
    static getId(url)
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
    constructor(id, title, duration)
    {
        this.type = "Youtube";
        this.id = id;
        this.title = title;
        this.duration = duration;
    }
    static requestData(url)
    {
        const id = Youtube.getId(url);
        const apiKey = "AIzaSyDTk1OPRI9cDkAK_BKsBcv10DQCHse-QaA";
        const fetchUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&fields=items(snippet/title,contentDetails/duration)&id=${id}&key=${apiKey}`
        return new Promise(function(resolve, reject) {
            fetch(fetchUrl).then(res => res.json())
            .then(json => {
                if(json.items[0] == null)
                {
                    res = null;
                    return;
                }
                const item = json.items[0];
                resolve(new Youtube(id, item.snippet.title, item.contentDetails.duration));
            })
            .catch(err => {
                reject(err);
            })
        })
    }
}
export default Youtube