const { killsPath, sqInfoPath } = require("./files.js");
const fs = require('fs');

let killsTable = JSON.parse(fs.readFileSync(killsPath));
let finalTable = JSON.parse(fs.readFileSync(sqInfoPath));

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

function writeFinalTable() {
	fs.writeFileSync(sqInfoPath, JSON.stringify(finalTable, null, 4));
}

function killTableToFinalTableIdx(killTableIdx) {
	const squadName = killsTable[killTableIdx].squadName
	for(let i = 0; i < finalTable.length; i++) {
		if(finalTable[i].squadName === squadName) {
			return i;
		}
	}
}

function isGameOver() {
	let alive = 0;
	for(let i = 0; i < killsTable.length; i++) {
		if(killsTable[i].alive) alive++;
		if(alive >= 2) return false;
	}
	return true;
}

function actions(io, socket) {
	socket.join('kills');

	socket.on('kill', (killerIdx, victimIdx) => {
		socket.to('kills').emit('kill', killerIdx, victimIdx);

		const idx = killTableToFinalTableIdx(killerIdx);
		killsTable[killerIdx].points += 1;
		finalTable[idx].points += 1;
		finalTable[idx].fin += 1;
		killsTable[victimIdx].alive -= 1;

		if(killsTable[victimIdx].alive === 0) {
			if((victimIdx + 1) <= 12) {
				finalTable[killTableToFinalTableIdx(victimIdx)].points += positionPoints[victimIdx + 1];
			}
			if(isGameOver()) {
				const idx = killTableToFinalTableIdx(killerIdx);
				finalTable[idx].points += positionPoints[killerIdx + 1];
				finalTable[idx].wwcd += 1;
			}
		}

		killsTable.sort((a, b) => b.points - a.points);
		finalTable.sort((a, b) => b.points - a.points);
		writeKillsTable();
		writeFinalTable();
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
