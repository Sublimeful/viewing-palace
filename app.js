import express from "express";
import {Server} from 'socket.io';

import VideoManager from "./src/VideoManager.js";
import path from "path";

const app = express();

const server = app.listen(8080, () => {
    console.log("🔥 server is listening on port 8080!")
})
const io = new Server(server);
VideoManager.io = io

io.on("connection", (socket) => {
    console.log("user connected!")
    socket.on("addVideo", (data) => {
        VideoManager.enqueue(data.input);
    })
    socket.on("disconnect", () => {
        console.log("user disconnected!")
    })
})

app.get("/", function (req, res) {
    res.sendFile("public/index.html", { root: path.dirname(".") });
});
app.use(express.static("public"));
