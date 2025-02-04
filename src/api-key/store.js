function createApiKeyStore(encodedKeys) {
  return new Set(encodedKeys.split(",").map((key) => key.trim()));
}

module.exports = {
  createApiKeyStore,
};
