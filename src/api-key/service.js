class ApiKeyService {
  constructor(store) {
    this.store = store;
  }

  verifyApiKey(apiKey) {
    return this.store.has(apiKey);
  }
}

module.exports = {
  ApiKeyService,
};
