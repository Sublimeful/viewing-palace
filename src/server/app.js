import express from "express";
import { Server } from "socket.io";

import VideoManager from "./VideoManager.js";
import path from "path";

const app = express();

const server = app.listen(8080, () => {
    console.log("🔥 server is listening on port 8080!");
});
const io = new Server(server);
VideoManager.io = io;

io.on("connection", (socket) => {
    VideoManager.loadVideo(socket);
    socket.on("addVideo", (data) => {
        VideoManager.enqueue(data.input, socket);
    });
    socket.on("pause", (data) => {
        VideoManager.pause(socket);
    });
    socket.on("unpause", (data) => {
        VideoManager.unpause(socket);
    });
    socket.on("sync", (data) => {
        socket

    })
});

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});
app.use(express.static("public"));
