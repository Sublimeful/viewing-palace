import express from "express";
import { Server } from "socket.io";

import VideoManager from "./VideoManager.js";
import path from "path";

const app = express();
const server = app.listen(8080, () => {
    console.log("🔥 server is listening on port 8080!");
});
const io = new Server(server);

var videoManager = new VideoManager(io);
io.on("connection", (socket) => {
    socket.isSignedIn = false;
    videoManager.loadVideo(socket);
    socket.on("addVideo", (data) => {
        if(socket.isSignedIn == false)
        {
            console.log("not signed in")
            return;
        }
        videoManager.enqueue(data.input, socket);
    });
    socket.on("pause", () => {
        if(socket.isSignedIn == false)
        {
            console.log("not signed in")
            return;
        }
        videoManager.pause(socket);
    });
    socket.on("unpause", () => {
        if(socket.isSignedIn == false)
        {
            console.log("not signed in")
            return;
        }
        videoManager.unpause(socket);
    });
    socket.on("signIn", (data) => {
        socket.username = data.username;
        socket.isSignedIn = true;
    })
    socket.on("sync", () => {
        if(videoManager.timer.currentTime == null)
            videoManager.timer.startTimer();
        else
            socket.emit("sync", {currentTime: videoManager.timer.getCurrentTime()});
    })
});

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});

app.use(express.static("public"));
