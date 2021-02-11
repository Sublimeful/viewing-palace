import express from "express";
import { Server } from "socket.io";

import VideoManager from "./VideoManager.js";
import path from "path";

const app = express();
const server = app.listen(8080, () => {
    console.log("🔥 server is listening on port 8080!");
});
const io = new Server(server);

var someoneIsLeader = false;
var videoManager = new VideoManager(io);
io.on("connection", (socket) => {
    socket.isSignedIn = false;
    videoManager.loadVideo(socket);
    socket.on("addVideo", (data) => {
        videoManager.enqueue(data.input, socket);
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
            videoManager.timer.startTimer();
            var videoEndedChecker = setInterval(() => {
                if (videoManager.currentPlaying != null) {
                    console.log("duration: " + videoManager.currentPlaying.duration);
                    console.log("currentTime: " + videoManager.timer.getCurrentTime());
                    if (videoManager.timer.getCurrentTime() > videoManager.currentPlaying.duration - 1000) {
                        const nextVideoIndex = videoManager.findIndex(videoManager.currentPlaying) + 1;
                        videoManager.currentPlaying = null;
                        /* 
                            GOAL:
                                add video ended event
                        */
                        if (nextVideoIndex < videoManager.queue.length) {
                            console.log("LOADED NEXT VIDEO")
                            videoManager.playNew(videoManager.queue[nextVideoIndex]);
                        }
                        clearInterval(videoEndedChecker);
                        console.log("set to NULL")
                    }
                }
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
