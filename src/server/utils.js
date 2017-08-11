import path from 'path';
import fs from 'fs';

const appDir = path.dirname(process.mainModule.paths[0].split('node_modules')[0].slice(0, -1)); // To find root of project dynamically
function _readJsonFileSync(filepath, encoding){
	if (typeof (encoding) == 'undefined') {
		encoding = 'utf8';
	}

	const file = fs.readFileSync(filepath, encoding);

	return JSON.parse(file);
}

export function getConfig(file){
	const filepath = path.join(appDir, '/dist/', file);
	return _readJsonFileSync(filepath);
}
