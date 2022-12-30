
const http = require("http");
const app = require("./app");

const httpServer = http.createServer(app);

const PORT = process.env.PORT || 8080;

httpServer.listen(PORT, () => {
    console.log(`app is running on port ${PORT}`)
});