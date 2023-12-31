const fs = require('fs');

const configPath = './config.json';
const parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));

// We have to exports each object in order to access them separately
exports.crypto = parsed.crypto;
exports.discogs = parsed.discogs;
exports.expressSession = parsed.expressSession;
exports.mongodb = parsed.mongodb;
exports.port = parsed.port;