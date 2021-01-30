const debug = require('debug')('registry:packument');

module.exports = function packumentWrapper(registryIndex) {
  return function packumentHandler(req, res) {
    debug(req.originalUrl);
    const pkgID = req.headers['pacote-pkg-id'].split('registry:')[1];
    const pkgRegistryVersions = registryIndex[pkgID];

    if (!pkgRegistryVersions) return res.sendStatus(404);

    res.json(pkgRegistryVersions);
  };
};
