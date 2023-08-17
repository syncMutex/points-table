const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = process.env.PORT || 5000;
const app = express();
const server = require("http").createServer(app);
const root = require('./routes/root');
const { init } = require('./files.js');
init();

app.use(cors());
app.use(bodyParser.json({limit: "200mb"}));

const io = require("socket.io")(server, {
	maxHttpBufferSize: 1e8,
	cors: { origin: "*" }
});
const socketActions = require("./socket-actions.js");

io.on('connection', socket => {
	socketActions(io, socket);
})


app.use('/api', root);

server.listen(PORT, () => console.log(`listening on port ${PORT}`));
