const fs = require('fs');
const path = require('path');

const configPath = path.resolve(__dirname, '../config/config.json');
const configData = fs.readFileSync(configPath, { encoding: 'utf-8' });
const Config = JSON.parse(configData);

module.exports = Config;
