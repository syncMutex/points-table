const fs = require('fs')

const sqInfoPath = "./data/squads.json";
const killsPath = "./data/kills.json";
const imagesDir = "./data/images";

function init() {
	if(!fs.existsSync(imagesDir)){
		fs.mkdirSync(imagesDir, { recursive: true });
	}

	if(!fs.existsSync(sqInfoPath)) {
		fs.writeFileSync(sqInfoPath, JSON.stringify([]));
	}
	if(!fs.existsSync(killsPath)) {
		fs.writeFileSync(killsPath, JSON.stringify([]));
	}
}

module.exports = { init, killsPath, sqInfoPath, imagesDir };
