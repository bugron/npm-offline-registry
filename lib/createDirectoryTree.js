const path = require('path');
const readDirContents = require('./utils/readDirContents');
const dirFilter = require('./utils/dirFilter');

// First part of the indexing algorithm: get paths of all packages in the registry
/**
 * Recursively creates a list of all package paths relative to the local npm registry
 *
 * @param {String} registryPath Local npm registry path
 * @returns {Arrary<String>} An array containing all package paths relative to registryPath
 */
function createDirectoryTree(registryPath) {
  const packages = readDirContents(registryPath).filter(dirFilter);
  function traversePackageTree(packageDir, tree) {
    const packageDirContents = readDirContents(path.join(registryPath, packageDir)).filter(dirFilter);
    // in case a package does not have any deps installed
    if (!packageDirContents.some(f => f.name === 'node_modules')) {
      // and it's a scoped package namespace folder
      if (packageDir.includes('@')) {
        return [...new Set(packageDirContents
          // make sure current dir is a package
          .filter(package => readDirContents(path.join(registryPath, packageDir, package.name)).some(f => f.name === 'package.json'))
          .reduce((all, { name }) => all.concat(
            traversePackageTree(
              path.join(packageDir, name),
              [...tree, path.join(packageDir, name)]
            )
          ), tree))];
      }

      // otherwise we're done
      return [...tree, packageDir];
    }

    // in case node_modules is empty or contians only dot folders (eg. react...)
    const nodeModulesDirContents = readDirContents(path.join(registryPath, packageDir, 'node_modules')).filter(dirFilter);
    if (!nodeModulesDirContents.length) {
      return [...tree, packageDir];
    }

    // in case package has any deps installed
    return nodeModulesDirContents.reduce((all, { name }) => {
      return [...new Set(all.concat(traversePackageTree(
        path.join(packageDir, 'node_modules', name),
        [...tree, packageDir]
      )))];
    }, tree);
  }
  return packages.reduce((all, package) => all.concat(traversePackageTree(package.name, [])), []);
}

module.exports = createDirectoryTree;
