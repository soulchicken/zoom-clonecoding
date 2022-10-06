import http from "http";
// import WebSocket from "ws";
import SocketIO from "socket.io";
import express from "express";

const app = express();

app.set("view engine", "pug");
app.set("views", __dirname + "/views");

app.use("/public", express.static(__dirname + "/public"));

app.get("/", (_, res) => res.render("home"));
app.get("/*", (_, res) => res.redirect("/"));

const handlerListen = () =>
  console.log(`Listening on http:http://localhost:3000/`);

const httpServer = http.createServer(app);
const wsServer = SocketIO(httpServer);
// const wss = new WebSocket.Server({ server });

// const sockets = [];

// wss.on("connection", (socket) => {
//   socket["nickname"] = "anon";
//   sockets.push(socket);
//   console.log("Connected to Browser ✅");

//   socket.on("close", () => {
//     console.log("Disconnected from Browser 🚫");
//   });

//   socket.on("message", (msg) => {
//     const massage = JSON.parse(msg);
//     switch (massage.type) {
//       case "new_massage":
//         sockets.forEach((aSocket) => {
//           aSocket.send(`${socket.nickname}: ${massage.payload}`);
//         });
//         break;

//       case "nickname":
//         socket["nickname"] = massage.payload;
//         console.log(massage.payload);
//         break;

//       default:
//         break;
//     }
//   });
//   socket.send("hello!!!");
// });

wsServer.on("connection", (socket) => {
  socket["nickname"] = "anon";
  socket.onAny((event) => {
    console.log(`Socket Event: ${event}`);
  });
  socket.on("enter_room", (roomName, done) => {
    socket.join(roomName);
    done();
    socket.to(roomName).emit("welcome", socket.nickname);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) =>
      socket.to(room).emit("bye", socket.nickname)
    );
  });

  socket.on("new_massage", (msg, room, done) => {
    socket.to(room).emit("new_massage", `${socket.nickname} : ${msg}`);
    done();
  });

  socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
});

httpServer.listen(3000, handlerListen);
