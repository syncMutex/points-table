const fs = require('fs')

const sqInfoPath = "./data/squads.json";
const killsPath = "./data/kills.json";
const imagesDir = "./data/images";
const getPath = () => {
	const date = new Date();

	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();

	let path = `./data/standings_${day}-${month}-${year}.json`;
	return path;
}
const oneDayTablePath = getPath();

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
	if(!fs.existsSync(oneDayTablePath)) {
		fs.writeFileSync(oneDayTablePath, JSON.stringify([]));
	}
}

module.exports = { init, killsPath, sqInfoPath, imagesDir, oneDayTablePath };
