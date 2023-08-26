const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const PORT = 5000;
const app = express();
const server = require("http").createServer(app);
const root = require('./routes/root');
const { init } = require('./files.js');
init();

app.use(cors({ origin: "*" }));
app.use(bodyParser.json({limit: "200mb"}));

const io = require("socket.io")(server, {
	maxHttpBufferSize: 1e8,
	cors: {
		origin: "*",
		methods: ["GET", "POST"],
		transports: ['websocket', 'polling'],
		credentials: true
	}
});
const socketActions = require("./socket-actions.js");

io.on('connection', socket => {
	socketActions(io, socket);
})


app.use('/api', root);

function getIPAddress() {
	var interfaces = require('os').networkInterfaces();
	for (var devName in interfaces) {
		var iface = interfaces[devName];

		for (var i = 0; i < iface.length; i++) {
			var alias = iface[i];
			if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
				return alias.address;
		}
	}
	return '0.0.0.0';
}

server.listen(PORT, () => {
	console.log(`{ host: '${getIPAddress()}', port: '${PORT}' }`)
});
