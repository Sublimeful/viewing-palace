class Raw
{
    constructor(video, socket)
    {
        fetch(video.url).then((res) => {
            console.log(res.headers);
        })
    }
    destroy()
    {

    }
}
module.exports = Raw;