const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const VideoManager = require("./src/VideoManager");

app.get('/', function(req, res) {
   res.sendFile("public/index.html", {root: __dirname});
});

io.on("connection", (socket) => {
    socket.on("addVideo", (userData) => {
        VideoManager.enqueue(userData.input);
        console.log(VideoManager.queue);
    })
    socket.on("disconnect", () => {
        console.log("user disconnected!");
    })
})

app.use(express.static('public'));

http.listen(8080, function() {
   console.log('listening on *:8080');
});