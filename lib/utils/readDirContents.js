const fs = require('fs');

/**
 *
 * @param {String} dirPath Path to a directory the contents of which is returned
 * @returns {Array<String>} List of files and folders which dirPath contains
 */
module.exports = function readDirContents(dirPath) {
  return fs.readdirSync(dirPath, { encoding: 'utf8', withFileTypes: true });
};
