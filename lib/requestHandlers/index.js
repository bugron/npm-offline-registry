const packument = require('./packument');
const tarball = require('./tarball');

module.exports = function(...args) {
  return {
    // 'packument' request is issued to get registry info about a package
    packument: packument(...args),
    // 'tarball' request is issued to download a specific version of a package
    tarball: tarball(...args),
  };
};
