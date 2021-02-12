
import fetch from "node-fetch";
import sha256 from 'crypto-js/sha256.js';
class Raw
{
    constructor(duration, url, contentType) {
        this.type = "Raw";
        this.contentType = contentType;
        this.duration = duration;
        this.url = url;
    }
    static requestVideoData(url)
    {
        return new Promise((resolve, reject) => {
            fetch(url)
            .then((res) => {
                const contentType = res.headers.get("Content-Type");
                const duration = res.headers.get("Content-Length");
                resolve(new Raw(duration, url, contentType));
            })
            .catch((error) => reject(error))
        })
    }
}
export default Raw;