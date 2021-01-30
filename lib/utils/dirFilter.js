/**
 *
 * @param {fs.Dirent} fsDirent An fs.Dirent object describing the directory/file being read
 * @returns {Boolean} Indicates wheather fsDirent is a directry and it's name does not begin with a dot
 */
module.exports = function dirFilter(fsDirent) {
  return fsDirent.isDirectory() && !fsDirent.name.startsWith('.');
};
