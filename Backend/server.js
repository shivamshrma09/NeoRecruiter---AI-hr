const http = require('http');
const app = require('./app');
// const initializeSocket = require('./socket'); // Uncomment if using socket
const port = process.env.PORT || 3000;

const server = http.createServer(app);

// initializeSocket(server); // Uncomment if using socket

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  });
  