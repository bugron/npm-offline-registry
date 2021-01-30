const router = require('express').Router();
const auditHandler = require('./audit');
const pingHandler = require('./ping');
const pacoteHandler = require('./pacote');

router.post('/-/npm/v1/security/audits/quick', auditHandler);
router.get('/-/ping', pingHandler);
router.use(pacoteHandler);

module.exports = router;
