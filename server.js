// server.js
const app = require("./app");
const PORT = 8081;
const HOST = '0.0.0.0';

// Start the server
const server = app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
});

// Export the server instance for testing
module.exports = server;
