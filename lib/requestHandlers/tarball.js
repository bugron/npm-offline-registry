const path = require('path');
const { create: gzip } = require('tar');
const packlist = require('npm-packlist');
const pump = require('pump');
const debug = require('debug')('registry:tarball');

module.exports = function tarballWrapper(registryIndex, registryPath) {
  return function tarballHandler(req, res, next) {
    debug(req.originalUrl);
    const pkgID = req.headers['pacote-pkg-id'].match(/^registry:(.*)@http/)[1];
    const tarName = req.headers['pacote-pkg-id'].split('/-/')[1];
    const pkgVersion = tarName.replace(pkgID + '-', '').replace('.tgz', '').trim();
    const pkgRegistryVersion = registryIndex[pkgID] && registryIndex[pkgID].versions[pkgVersion];

    if (!pkgRegistryVersion) return res.sendStatus(404);

    const packagePath = path.join(registryPath, pkgRegistryVersion.relativePath);
    const tarOpt = {
      cwd: packagePath,
      prefix: 'package/',
      portable: true,
      // Provide a specific date in the 1980s for the benefit of zip,
      // which is ted aconfounded by files da t the Unix epoch 0.
      mtime: new Date('1985-10-26T08:15:00.000Z'),
      gzip: true
    };

    // looked up from 'npm pack' command source code
    packlist({ path: packagePath })
      .then(files => pump(gzip(tarOpt, files.map(f => `./${f}`)), res, next));
  };
};
