const { killsPath, sqInfoPath, oneDayTablePath } = require("./files.js");
const fs = require('fs');

let killsTable = JSON.parse(fs.readFileSync(killsPath));
let finalTable = JSON.parse(fs.readFileSync(sqInfoPath));
let standings = JSON.parse(fs.readFileSync(oneDayTablePath));

let positionPoints = {
	1: 15,
	2: 12,
	3: 10,
	4: 8,
	5: 6,
	6: 4,
	7: 2
};
for(let i = 8; i <= 12; i++) positionPoints[i] = 1;

function writeKillsTable() {
	fs.writeFileSync(killsPath, JSON.stringify(killsTable, null, 4));
}

// function writeFinalTable() {
// 	fs.writeFileSync(sqInfoPath, JSON.stringify(finalTable, null, 4));
// }

function writeStandings() {
	fs.writeFileSync(oneDayTablePath, JSON.stringify(standings, null, 4));
}

function killsTableIdx(squadName) {
	for(let i = 0; i < killsTable.length; i++) {
		if(killsTable[i].squadName === squadName) {
			return i;
		}
	}
	return -1;
}

// function finalTableIdx(squadName) {
// 	for(let i = 0; i < finalTable.length; i++) {
// 		if(finalTable[i].squadName === squadName) {
// 			return i;
// 		}
// 	}
// 	return -1;
// }

function standingsIdx(squadName) {
	for(let i = 0; i < standings.length; i++) {
		if(standings[i].squadName === squadName) {
			return i;
		}
	}
	return -1;
}

function actions(_, socket) {
	socket.join('kills');

	socket.on("set-alive", (squadName, count) => {
		const idx = killsTableIdx(squadName);
		if(idx === -1) return;
		killsTable[idx].alive = count;
		socket.to('kills').emit("set-alive", squadName, count);
	});

	socket.on("set-points", (squadName, val) => {
		let idx = killsTableIdx(squadName);
		if(idx === -1) return;
		killsTable[idx].points = val;
		killsTable.sort((a, b) => b.points - a.points);

		idx = standingsIdx(squadName);
		if(idx === -1) return;
		standings[idx].points = val;
		standings.sort((a, b) => b.points - a.points);

		socket.to('kills').emit("set-points", squadName, val);
		writeKillsTable();
		writeStandings();
	});

	socket.on("set-standings-fin-points", (squadName, fin, points) => {
		const idx = standingsIdx(squadName);
		if(idx === -1) return;
		standings[idx].points = points;
		standings[idx].fin = fin;
		standings.sort((a, b) => b.points - a.points);

		writeKillsTable();
		writeStandings();
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
