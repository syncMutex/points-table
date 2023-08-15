const express = require("express");
const fs = require('fs');
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

const sqInfoPath = "./data/squads.json";
const btnsPath = "./data/btns.json";

app.use(cors());
app.use(bodyParser.json({limit: "200mb"}));

app.post("/api/save-squads", (req, res) => {
	try{
		const jsonFile = fs.openSync(sqInfoPath, "w");
		const squads = req.body.map(squad => {	
			const fp = `data/images/${squad.squadName}`;
			const imageFile = fs.openSync(fp, "w");
			fs.writeSync(imageFile, squad.img);
			squad.img = fp;
			return squad;
		});
		fs.writeSync(jsonFile, JSON.stringify(squads, null, 4));
		res.json({ err: false, msg: "success" });
	} catch(e) {
		res.json({ err: true, msg: e });
		throw e;
	}
});

app.post("/api/save-btns", (req, res) => {
	try{
		const jsonFile = fs.openSync(btnsPath, "w");
		const btns = req.body;
		fs.writeSync(jsonFile, JSON.stringify(btns, null, 4));
		res.json({ err: false, msg: "success" });
	} catch(e) {
		res.json({ err: true, msg: e });
		throw e;
	}
});

app.get("/api/squads", (_, res) => {
	const squadsInfoFile = fs.openSync(sqInfoPath, "r");
	const squads = JSON.parse(fs.readFileSync(squadsInfoFile));
	const squadsWithImages = squads.map(s => {
		s.img = fs.readFileSync(s.img, 'utf8');
		return s;
	});
	fs.close(squadsInfoFile);
	res.json(squadsWithImages);
});

app.get("/api/btns", (_, res) => {
	const btnsFile = fs.openSync(btnsPath, "r");
	const btns = JSON.parse(fs.readFileSync(btnsFile));
	fs.close(btnsFile);
	res.json(btns);
});

function init() {
	const dir = "./data/images";
	if(!fs.existsSync(dir)){
		fs.mkdirSync(dir, { recursive: true });
	}

	if(!fs.existsSync(sqInfoPath)) {
		const jsonFile = fs.openSync(sqInfoPath, "w");
		fs.writeSync(jsonFile, JSON.stringify([]));
		fs.close(jsonFile);
	}

	if(!fs.existsSync(btnsPath)) {
		const jsonFile = fs.openSync(btnsPath, "w");
		fs.writeSync(jsonFile, JSON.stringify([]));
		fs.close(jsonFile);
	}
}

init();

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
