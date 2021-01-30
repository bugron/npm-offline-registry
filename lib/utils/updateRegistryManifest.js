const semverComparator = require('semver-compare');

/**
 *
 * @param {Object} registry An object containing registry index items
 * @param {Object} package An object containing a package to be added to the registry
 * @returns {Object} updated registry object
 */
function updateRegistryManifest(registry, package) {
  const {
    name,
    version,
    dependencies,
    devDependencies,
    description,
    relativePath
  } = package;

  if(!registry[name]) {
    registry[name] = {
      name,
      'dist-tags': {
        latest: version
      },
      version,
      latest: version,
      versions: {
        [version]: {
          name,
          version,
          dependencies,
          devDependencies,
          relativePath
        }
      },
      description,
      dist: {}
    };
  }

  if (!registry[name].versions[version]) {
    registry[name].versions[version] = {
      name,
      version,
      dependencies,
      devDependencies,
      relativePath
    };
    const allVersions = Object.keys(registry[name].versions).sort(semverComparator);
    const latestVersion = allVersions[allVersions.length - 1];
    registry[name].latest = latestVersion;
    registry[name].version = latestVersion;
    registry[name]['dist-tags'].latest = latestVersion;
  }

  return registry;
}

module.exports = updateRegistryManifest;
