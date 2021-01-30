module.exports = function auditHandler(req, res) {
  res.json({
    metadata: {
      totalDependencies: 4
    }
  });
};
