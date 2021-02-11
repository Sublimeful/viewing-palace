import fetch from "node-fetch";
class YouTube {
    constructor(id, title, duration) {
        this.type = "YouTube";
        this.id = id;
        this.title = title;
        this.duration = duration;
    }
    equals(other) {
        return (
            this.type === other.type &&
            this.id === other.id &&
            this.title === other.title &&
            this.duration === other.duration
        );
    }
    static getId(url) {
        if (url.includes("youtube.com/watch?v=")) {
            var i = url.indexOf("youtube.com/watch?v=");
            return url.substring(i + 20, i + 20 + 11);
        } else if (url.includes("youtube.com/")) {
            var i = url.indexOf("youtube.com/");
            return url.substring(i + 12, i + 12 + 11);
        } else if (url.includes("youtu.be/")) {
            var i = url.indexOf("youtu.be/");
            return url.substring(i + 9, i + 9 + 11);
        }
    }
    static requestData(url) {
        const id = YouTube.getId(url);
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
                .catch((err) => {
                    reject(err);
                });
        });
    }
}
export default YouTube;
