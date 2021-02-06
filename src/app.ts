import * as express from "express";

const app = express();
app.set("port", process.env.PORT || 8080);

let http = require("http").Server(app);

let io = require("socket.io")(http);
import S from "./server/server";
const server = new S();


app.get("/", function(req, res) {
    res.sendFile("/public/index.html", { root: __dirname });
})

app.use(express.static(__dirname + "/public"))

io.on("connection", (socket: any) => {
    server.user_count++;
    socket.on("disconnect", () => {
        server.user_count--;
    })
})

http.listen(8080, () => {
    console.log("listening on *:8080");
})




















































