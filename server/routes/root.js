const express = require("express");
const fs = require('fs');
const router = express.Router();
let { sqInfoPath, oneDayTablePath } = require('../files.js');

router.post("/save-squads", (req, res) => {
	try{
		const squads = req.body.map(squad => {	
			const fp = `data/images/${squad.squadName}`;
			fs.writeFileSync(fp, squad.img);
			squad.img = fp;
			return squad;
		});
		fs.writeFileSync(sqInfoPath, JSON.stringify(squads, null, 4));
		fs.writeFileSync(oneDayTablePath, JSON.stringify(squads, null, 4));
		res.json({ err: false, msg: "success" });
	} catch(e) {
		res.json({ err: true, msg: e });
		throw e;
	}
});

router.get("/squads", (_, res) => {
	const squads = JSON.parse(fs.readFileSync(sqInfoPath));
	const squadsWithImages = squads.map(s => {
		s.img = fs.readFileSync(s.img, 'utf8');
		return s;
	});
	res.json(squadsWithImages);
});

router.delete("/reset-standings", (_, res) => {
	const squads = JSON.parse(fs.readFileSync(sqInfoPath));
	for(let s of squads) {
		s.wwcd = 0;
		s.pla = 0;
		s.fin = 0;
		s.points = 0;
	}
	fs.writeFileSync(oneDayTablePath, JSON.stringify(squads));
	res.json({ err: false, msg: "reset success" });
});

router.delete("/reset-final-table", (_, res) => {
	const squads = JSON.parse(fs.readFileSync(sqInfoPath));
	for(let s of squads) {
		s.wwcd = 0;
		s.pla = 0;
		s.fin = 0;
		s.points = 0;
	}
	fs.writeFileSync(sqInfoPath, JSON.stringify(squads));
	res.json({ err: false, msg: "reset success" });
});

router.get("/standings", (_, res) => {
	const squads = JSON.parse(fs.readFileSync(oneDayTablePath));
	const squadsWithImages = squads.map(s => {
		s.img = fs.readFileSync(s.img, 'utf8');
		return s;
	});
	res.json(squadsWithImages);
});

module.exports = router;
