let io;

module.exports = {
  init: (httpServer) => {
    io = require("socket.io")(httpServer, {
      cors: {
        origin: true,
        methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      },
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket is not init!");
    } else {
      return io;
    }
  },
};
