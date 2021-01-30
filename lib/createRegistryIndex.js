const fs = require('fs');
const path = require('path');
const debug = require('debug')('registry:index');
const ProgressBar = require('progress');
const createDirectoryTree = require('./createDirectoryTree');
const dirFilter = require('./utils/dirFilter');
const readDirContents = require('./utils/readDirContents');
const updateRegistryManifest = require('./utils/updateRegistryManifest');

/**
 * Builds or loads the index of all npm packages located in the local npm registry directory
 *
 * @param {String} registryPath Local npm registry path
 * @returns {Object} An object containing all registry packages
 */
function createRegistryIndex(registryPath) {
  // mock packages that are required but not installable on a particular platform (eg. fsevents on win32)
  const dummyPackages = readDirContents(path.resolve(registryPath, '..', 'dummy_modules'))
    .filter(dirFilter)
    .map(({ name }) => `..\\dummy_modules\\${name}`);

  if (!process.argv.includes('--rebuildIndex')) {
    try {
      debug('Loading index.json...');
      const index = require(path.resolve(registryPath, '..', 'index.json'));
      debug('Index loaded!', `${index.metaData.count} distinct package versions are indexed`);
      return index;
    } catch(e) {}
  }

  debug('Creating registry index for the path', registryPath);
  debug('Traversing registry directory to identify npm packages...');

  // Second part of the indexing algorithm: build up the index
  // Keep track of added packages to not include them in the index twice
  const packageList = {};
  const packageDirs = [...createDirectoryTree(registryPath), ...dummyPackages];
  const progressBar = new ProgressBar('Creating registry index... [:bar] :percent ETA: :etas', {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: packageDirs.length
  });
  let indexCount = 0;

  const index = packageDirs.reduce(function dirTreeReducer(registry, dir) {
    try {
      const packageJSON = require(path.join(registryPath, dir, 'package.json'));

      if (!packageJSON.name || !packageJSON.version) {
        progressBar.tick(1);
        // not an actual npm package, just a folder with a package.json file in it
        return registry;
      }

      const slug = `${packageJSON.name}-${packageJSON.version}`;

      if (!packageList[slug]) {
        registry = updateRegistryManifest(registry, Object.assign({}, packageJSON, {
          relativePath: dir
        }));
        indexCount += 1;
        packageList[slug] = true;
      }
    } catch(e) {
      // do not fail, just log
      console.error(e);
    }

    progressBar.tick(1);
    return registry;
  }, {});

  fs.writeFileSync(path.resolve(registryPath, '..', 'index.json'), JSON.stringify(Object.assign({}, index, {
    metaData: { count: indexCount }
  })));

  debug('Index created!', `${indexCount} distinct package versions are indexed`);
  return index;
}

module.exports = createRegistryIndex;
