const socketIo = require("socket.io");
const userModel = require("./models/hr.model");
// const captainModel = require('./models/captain.model'); // Uncomment if needed

let io;

function initializeSocket(server) {
  io = socketIo(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("join", async (data) => {
      const { userId, userType } = data;
      if (userType === "user") {
        await userModel.findByIdAndUpdate(userId, { socketId: socket.id });
      }
     
    });

   
  });
}

module.exports = initializeSocket;
