const Room = require("../models/room");
const { canControlPlayback, isHost } = require("../middleware/permissions");

module.exports = (io) => {
  io.on("connection", (socket) => {
    // JOIN ROOM
    socket.on("join_room", async ({ roomId, username }) => {
      try {
        let room = await Room.findOne({
          roomId,
        });

        // Create room if not exists
        if (!room) {
          room = await Room.create({
            roomId,
            participants: [],
          });
        }

        socket.join(roomId);

        let role;

        username = username.trim().toLowerCase();

        const existingUser = room.participants.find(
          (p) => p.username.trim().toLowerCase() === username,
        );

        if (existingUser) {
          existingUser.socketId = socket.id;

          role = existingUser.role;
        } else {
          role = room.participants.length === 0 ? "host" : "participant";

          room.participants.push({
            socketId: socket.id,
            username,
            role,
          });
        }

        await room.save();

        // Send participants list
        io.to(roomId).emit("user_joined", room.participants);

        // Send current room state
        socket.emit("sync_state", {
          videoId: room.videoId,
          currentTime: room.currentTime,
          isPlaying: room.isPlaying,
        });
      } catch (error) {
        console.error(error);
      }
    });

    // PLAY EVENT
    socket.on("play", async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        if (!user || !canControlPlayback(user.role)) {
          return;
        }

        room.isPlaying = true;

        await room.save();

        io.to(roomId).emit("play");
      } catch (error) {
        console.error(error);
      }
    });

    // PAUSE EVENT
    socket.on("pause", async ({ roomId }) => {
      try {
        const room = await Room.findOne({ roomId });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        if (!user || !canControlPlayback(user.role)) {
          return;
        }

        room.isPlaying = false;

        await room.save();

        io.to(roomId).emit("pause");
      } catch (error) {
        console.error(error);
      }
    });

    //seek
    socket.on("seek", async ({ roomId, time }) => {
      try {
        const room = await Room.findOne({
          roomId,
        });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        if (!user || !canControlPlayback(user.role)) {
          return;
        }

        room.currentTime = time;

        await room.save();

        io.to(roomId).emit("seek", time);
      } catch (error) {
        console.error(error);
      }
    });

    // video change

    socket.on("change_video", async ({ roomId, videoId }) => {
      try {
        const room = await Room.findOne({
          roomId,
        });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        if (!user || !canControlPlayback(user.role)) {
          return;
        }

        room.videoId = videoId;

        room.currentTime = 0;

        await room.save();

        io.to(roomId).emit("change_video", videoId);
      } catch (error) {
        console.error(error);
      }
    });

    // ASSIGN ROLE
    socket.on("assign_role", async ({ roomId, targetSocketId, role }) => {
      try {
        const room = await Room.findOne({
          roomId,
        });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        // Sirf host role assign kar sakta hai
        if (!user || !isHost(user.role)) {
          return;
        }

        const targetUser = room.participants.find(
          (p) => p.socketId === targetSocketId,
        );

        if (!targetUser) return;

        targetUser.role = role;

        await room.save();

        io.to(roomId).emit("role_assigned", room.participants);
      } catch (error) {
        console.error(error);
      }
    });

    // REMOVE PARTICIPANT
    socket.on("remove_participant", async ({ roomId, targetSocketId }) => {
      try {
        const room = await Room.findOne({
          roomId,
        });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        // Sirf host remove kar sakta hai
        if (!user || !isHost(user.role)) {
          return;
        }

        // Removed user ko notify karo
        io.to(targetSocketId).emit("kicked");

        // Participants array se hatao
        room.participants = room.participants.filter(
          (p) => p.socketId !== targetSocketId,
        );

        await room.save();

        // Sabko updated list bhejo
        io.to(roomId).emit("participant_removed", room.participants);
      } catch (error) {
        console.error(error);
      }
    });

    // DISCONNECT
    socket.on("disconnect", async () => {
      try {
        const room = await Room.findOne({ "participants.socketId": socket.id });

        if (!room) return;

        const user = room.participants.find((p) => p.socketId === socket.id);

        if (user) {
          user.socketId = null;
        }

        await room.save();

        io.to(room.roomId).emit("user_left", room.participants);
      } catch (error) {
        console.error(error);
      }
    });
  });
};
