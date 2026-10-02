const axios = require('axios');

// Evolution Go: instance routes authenticate with the per-instance token, admin routes with the global key.
class EvolutionApi {
  constructor({ baseUrl, globalKey, instanceName, instanceToken }) {
    this.baseUrl = baseUrl.replace(/\/+$/, '');
    this.globalKey = globalKey;
    this.instanceName = instanceName;
    this.instanceToken = instanceToken || null;
  }

  request(method, url, { data, admin = false } = {}) {
    return axios({
      method,
      url: this.baseUrl + url,
      data,
      timeout: 20000,
      headers: { 'Content-Type': 'application/json', apikey: admin ? this.globalKey : this.instanceToken },
    }).then((r) => r.data);
  }

  async resolveInstanceToken() {
    if (this.instanceToken) return this.instanceToken;
    const res = await this.request('get', '/instance/all', { admin: true });
    const inst = (res.data || []).find((i) => i.name.toLowerCase() === this.instanceName.toLowerCase());
    if (!inst) throw new Error(`Evolution instance "${this.instanceName}" not found`);
    this.instanceToken = inst.token;
    return this.instanceToken;
  }

  async sendText(to, text) {
    await this.resolveInstanceToken();
    const number = to.includes('@') ? to : to.replace(/[^0-9]/g, '');
    return this.request('post', '/send/text', { data: { number, text } });
  }

  async getStatus() {
    await this.resolveInstanceToken();
    const res = await this.request('get', '/instance/status');
    return res.data;
  }

  async setWebhook(webhookUrl) {
    await this.resolveInstanceToken();
    return this.request('post', '/instance/connect', {
      data: { webhookUrl, subscribe: ['MESSAGE'], immediate: true },
    });
  }
}

module.exports = EvolutionApi;
