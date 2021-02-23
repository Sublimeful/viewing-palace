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
    socket.on("playNow", (data) => {
        if (socket.isLeader) videoManager.playNew(data.video);
    });
    socket.on("videoEnded", () => {
        if (socket.isLeader) videoManager.playNext();
    });
    socket.on("move", (data) => {
        if (socket.isLeader)
            videoManager.move(data.moveInfo[0], data.moveInfo[1]);
    });
    socket.on("enqueue", (data) => {
        videoManager.parseInput(data.input, data.title);
    });
    socket.on("dequeue", (data) => {
        if (socket.isLeader) videoManager.dequeue(data.video);
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
                videoManager.unpause();
                socket.emit("unleadered");
            }
        }
    });
    socket.on("sync", (data) => {
        videoManager.handleSync(data, socket);
    });
    socket.on("disconnect", () => {
        if (socket.isLeader) {
            socket.isLeader = false;
            someoneIsLeader = false;
            videoManager.unpause();
        }
    });
});

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});

app.use(express.static("public"));
