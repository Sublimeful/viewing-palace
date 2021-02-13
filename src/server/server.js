import express from "express";
import { Server } from "socket.io";

import VideoManager from "./VideoManager.js";
import path from "path";

const app = express();

var port = process.env.PORT || 3000;
const server = app.listen(port, () => {
    console.log("🔥 server is listening on port " + port + "!");
});
const io = new Server(server);

var someoneIsLeader = false;
var videoManager = new VideoManager(io);
io.on("connection", (socket) => {
    socket.isSignedIn = false;
    videoManager.loadVideo(socket);
    socket.on("enqueue", (data) => {
        videoManager.parseInput(data.input, socket);
    });
    socket.on("dequeue", (data) => {
        if (socket.isLeader) {
            videoManager.dequeue(data.video);
            io.emit("dequeue", { video: data.video });
        }
    });
    socket.on("pause", () => {
        if (socket.isLeader) {
            videoManager.pause(socket);
        }
    });
    socket.on("unpause", () => {
        if (socket.isLeader) {
            videoManager.unpause(socket);
        }
    });
    socket.on("signIn", (data) => {
        socket.username = data.username;
        socket.isSignedIn = true;
    });
    socket.on("leaderButtonPressed", () => {
        if (socket.isSignedIn) {
            if (!someoneIsLeader) {
                socket.isLeader = true;
                someoneIsLeader = true;
                socket.emit("leadered");
            } else if (socket.isLeader) {
                socket.isLeader = false;
                someoneIsLeader = false;
                videoManager.unpause(socket);
                socket.emit("unleadered");
            }
        }
    });
    socket.on("sync", (data) => {
        if (videoManager.timer.currentTime == null) {
            if (
                data.duration != null &&
                videoManager.currentPlaying != null
            ) {
                //if video is raw, then set the duration
                videoManager.currentPlaying.duration = data.duration;
                setTimeout(() => {
                    videoManager.newVideoStarted();
                }, 1000);
            } else
                setTimeout(() => {
                    videoManager.newVideoStarted();
                }, 1000);
        } else if (socket.isLeader && data != null) {
            videoManager.timer.setTimer(data.currentTime * 1000);
        } else {
            socket.emit("sync", {
                currentTime: videoManager.timer.getCurrentTime(),
            });
        }
    });
    socket.on("disconnect", () => {
        if (socket.isLeader) {
            socket.isLeader = false;
            someoneIsLeader = false;
            videoManager.unpause(socket);
        }
    });
});

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});

app.use(express.static("public"));
