class Raw
{
    constructor(video, socket)
    {
        this.socket = socket;
        fetch(video.url).then((res) => {
            const blob = res.blob();
            const src = window.URL.createObjectURL(blob);
            const elem = document.getElementById()
            this.playerElem = document.getElementById("player");
            this.playerContainer = document.createElement("div");
            this.playerContainer.id = "video-player";
        })
    }
    destroy()
    {

    }
}
module.exports = Raw;