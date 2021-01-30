const path = require('path');
const debug = require('debug')('registry:pacote');
const requestHandlersFactory = require('../lib/requestHandlersFactory');

const REGISTRY_PATH = process.env.REGISTRY_PATH || path.join(process.cwd(), 'registry/node_modules');
const requestHandlers = requestHandlersFactory(REGISTRY_PATH);

module.exports = function pacoteHandler(req, res, next) {
  if (!req.headers['pacote-req-type'] && !req.headers['pacote-pkg-id']) {
    debug('Body', req.body);
    debug('Headers', req.headers);
    debug(`Skipping ${req.method} ${req.originalUrl}`);
    return next();
  }
  requestHandlers[req.headers['pacote-req-type']](req, res, next);
};
