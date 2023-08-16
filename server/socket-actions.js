const { killsPath, sqInfoPath } = require("./files.js");
const fs = require('fs');

let killsTable = JSON.parse(fs.readFileSync(killsPath));

function writeKillsTable() {
	fs.writeFileSync(killsPath, JSON.stringify(killsTable, null, 4));
}

function actions(io, socket) {
	socket.join('kills');

	socket.on('kill', (killerIdx, victimIdx) => {
		socket.to('kills').emit('kill', killerIdx, victimIdx);
		killsTable[killerIdx].points += 1;
		killsTable[victimIdx].alive -= 1;
		killsTable.sort((a, b) => b.points - a.points);
		writeKillsTable();
	});
	
	socket.on('get-kills-table', () => {
		let squads = killsTable.map(s => {
			s = {...s};
			const img = fs.readFileSync(s.img, 'utf8');
			s.img = img;
			return s;
		});

		socket.emit('get-kills-table-res', squads);
	});

	socket.on('reset-kills-table', () => {
		const squads = JSON.parse(fs.readFileSync(sqInfoPath)).map(s => ({
			img: s.img,
			squadName: s.squadName,
			points: 0,
			alive: 4
		}));
		killsTable = squads;
		writeKillsTable();
	})
}

module.exports = actions;
