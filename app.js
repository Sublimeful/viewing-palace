import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import VideoManager from "./src/VideoManager.js";
import path from "path";
const app = express();
const httpServer = createServer();
const io = new Server(httpServer);

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});

io.on("connection", (socket) => {
    console.log("user connected!");
    socket.on("addVideo", (userData) => {
        console.log("ASDAS");
        VideoManager.enqueue(userData.input);
        console.log(VideoManager.queue);
    });
    socket.on("disconnect", () => {
        console.log("user disconnected!");
    });
});

app.use(express.static("public"));

httpServer.listen(8080, function () {
    console.log("listening on *:8080");
});
