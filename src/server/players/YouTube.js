import fetch from "node-fetch";
class YouTube {
    constructor(id, title, duration) {
        this.type = "YouTube";
        this.id = id;
        this.title = title;
        this.duration = duration;
    }
    static isEqual(video, other) {
        return (
            video.type === other.type &&
            video.id === other.id &&
            video.title === other.title &&
            video.duration === other.duration
        );
    }
    static getId(url, type) {
        const matchVideo = /youtube\.com.*v=([A-z0-9_-]+)/;
        const matchPlaylist = /youtube\.com.*list=([A-z0-9_-]+)/;
        switch (type) {
            case "Video":
                return url.match(matchVideo)[1];
            case "Playlist":
                return url.match(matchPlaylist)[1];
        }
    }
    static requestVideoData(url, id = null) {
        if (id == null) id = YouTube.getId(url, "Video");
        const apiKey = "AIzaSyDTk1OPRI9cDkAK_BKsBcv10DQCHse-QaA";
        const fetchUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&fields=items(snippet/title,contentDetails/duration)&id=${id}&key=${apiKey}`;
        return new Promise(function (resolve, reject) {
            fetch(fetchUrl)
                .then((res) => res.json())
                .then((json) => {
                    if (json.items[0] == null) {
                        res = null;
                        return;
                    }
                    const item = json.items[0];
                    var matchHours = /([0-9]+)H/;
                    var matchMinutes = /([0-9]+)M/;
                    var matchSeconds = /([0-9]+)S/;
                    matchHours = item.contentDetails.duration.match(matchHours);
                    matchMinutes = item.contentDetails.duration.match(
                        matchMinutes
                    );
                    matchSeconds = item.contentDetails.duration.match(
                        matchSeconds
                    );
                    const hours =
                        matchHours == null ? 0 : parseInt(matchHours[1]);
                    const minutes =
                        matchMinutes == null ? 0 : parseInt(matchMinutes[1]);
                    const seconds =
                        matchSeconds == null ? 0 : parseInt(matchSeconds[1]);
                    const duration =
                        seconds * 1000 +
                        minutes * 60 * 1000 +
                        hours * 60 * 60 * 1000;
                    resolve(new YouTube(id, item.snippet.title, duration));
                })
                .catch((err) => reject(err));
        });
    }
    static requestPlaylistData(url) {
        const id = YouTube.getId(url, "Playlist");
        const apiKey = "AIzaSyDTk1OPRI9cDkAK_BKsBcv10DQCHse-QaA";
        const fetchUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&fields=nextPageToken,items(snippet/resourceId/videoId)&playlistId=${id}&key=${apiKey}`;
        return new Promise((resolve, reject) => {
            var res = [];
            fetch(fetchUrl)
                .then((res) => res.json())
                .then((json) => {
                    const resolver = async() => {
                        const pusher = async() => {
                            for (var i = 0; i < json.items.length; ++i) {
                                const item = json.items[i];
                                const id = item.snippet.resourceId.videoId;
                                res.push(await this.requestVideoData(null, id));
                            }
                        }
                        await pusher();
                        resolve(res);
                    }
                    resolver();
                })
                .catch((err) => reject(err));
        });
    }
}
export default YouTube;
