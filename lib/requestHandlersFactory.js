const createRegistryIndex = require('./createRegistryIndex');
const requestHandlers = require('./requestHandlers');

/**
 * Creates pacote request handlers based on 'pacote-req-type' HTTP header value
 *
 * @param {String} registryPath Path to the local npm registry
 * @returns {Object} An object containing 'pacument' and 'tarball' pacote (npm's fetcher) request type handlers
 */
function requestHandlersFactory(registryPath) {
  const registryIndex = createRegistryIndex(registryPath);

  return requestHandlers(registryIndex, registryPath);
}

module.exports = requestHandlersFactory;
