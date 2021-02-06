"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const app = express();
app.set("port", process.env.PORT || 8080);
let http = require("http").Server(app);
let io = require("socket.io")(http);
const Server_1 = require("./server/Server");
const server = new Server_1.default();
app.get("/", function (req, res) {
    res.sendFile("/public/index.html", { root: __dirname });
});
app.use(express.static(__dirname + "/public"));
io.on("connection", (socket) => {
});
http.listen(8080, () => {
    console.log("listening on *:8080");
});
//# sourceMappingURL=App.js.map