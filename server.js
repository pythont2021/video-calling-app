console.log("server running..");

import express from "express";
import { createServer } from "http";
import cors from "cors";
import { Server } from "socket.io";

// app setup
const app = express();
app.use(cors());
const httpServer = new createServer(app);
const io = new Server(httpServer, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const PORT = process.env.PORT || 3000;
// app routes

app.get("/", (req, res) => {
  res.send("Server Running...");
});

// socket io
io.on("connection", (socket) => {
  socket.emit("me", socket.id);

  socket.on("disconnect", () => {
    socket.broadcast.emit("callEnded");
  });

  socket.on("callUser", ({ userToCall, signalData, from, name }) => {
    io.to(userToCall).emit("callUser", { signal: signalData, from, name });
  });

  socket.on("answerCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

httpServer.listen(PORT, () => console.log("http://localhost:" + PORT));

