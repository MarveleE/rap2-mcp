import { fetch } from 'undici';

export class Rap2Client {
  constructor({ baseUrl, email, password, sid, sidSig, onCookieUpdate, logger } = {}) {
    this.baseUrl = baseUrl?.replace(/\/$/, '') || '';
    this.email = email || '';
    this.password = password || '';
    this.cookies = {};
    this.alwaysLoginBeforeRequest = false;
    this.onCookieUpdate = typeof onCookieUpdate === 'function' ? onCookieUpdate : null;
    this.logger = logger || null;
    if (sid && sidSig) {
      this.cookies['koa.sid'] = sid;
      this.cookies['koa.sid.sig'] = sidSig;
    }
  }

  cookieHeader() {
    const parts = Object.entries(this.cookies)
      .filter(([_, v]) => v)
      .map(([k, v]) => `${k}=${v}`);
    return parts.length ? parts.join('; ') : '';
  }

  async _fetch(path, { method = 'GET', headers = {}, body, timeoutMs = 20000, __skipPreLogin = false } = {}) {
    if (this.alwaysLoginBeforeRequest && !__skipPreLogin) {
      try { await this.login(); } catch {}
    }
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const url = path.startsWith('http') ? path : `${this.baseUrl}${path}`;
    const h = {
      'Accept': '*/*',
      'User-Agent': 'rap_mcp_tool/0.1',
      ...headers,
    };
    if (this.cookieHeader()) h['Cookie'] = this.cookieHeader();
    try {
      if (this.logger) this.logger.info({ url, method }, 'rap2 fetch start');
      const res = await fetch(url, { method, headers: h, body, signal: controller.signal });
      const setCookie = res.headers.get('set-cookie');
      if (setCookie) this._ingestSetCookie(setCookie);
      const text = await res.text();
      let json;
      try { json = JSON.parse(text); } catch { json = { raw: text.slice(0, 500) }; }
      if (this.logger) this.logger.info({ url, method, status: res.status }, 'rap2 fetch done');
      return { status: res.status, data: json };
    } finally {
      clearTimeout(timer);
    }
  }

  _ingestSetCookie(setCookie) {
    // naive parser for koa sid; supports multiple cookies separated by comma
    const items = setCookie.split(/,(?=[^;]+=)/g);
    for (const item of items) {
      const m = item.trim().match(/^([^=]+)=([^;]+)/);
      if (!m) continue;
      const name = m[1];
      const value = m[2];
      if (name === 'koa.sid' || name === 'koa.sid.sig') {
        this.cookies[name] = value;
        if (this.onCookieUpdate) {
          try { this.onCookieUpdate({ name, value }); } catch {}
        }
      }
    }
  }

  getCookies() {
    return { sid: this.cookies['koa.sid'], sidSig: this.cookies['koa.sid.sig'] };
    }

  setCookies({ sid, sidSig } = {}) {
    if (sid) this.cookies['koa.sid'] = sid;
    if (sidSig) this.cookies['koa.sid.sig'] = sidSig;
  }

  async login() {
    // 0) If preset cookies exist, try verify
    if (this.cookies['koa.sid'] && this.cookies['koa.sid.sig']) {
      if (this.logger) this.logger.info({ step: 'verify-cookie' }, 'login flow');
      const verify = await this._fetch('/repository/joined', { __skipPreLogin: true });
      if (verify?.data && verify.data.isOk) return { status: '登录成功(使用Cookie)' };
    }

    // 1) Warm-up to obtain cookies
    if (this.logger) this.logger.info({ step: 'warmup' }, 'login flow');
    await this._fetch('/account/info', { __skipPreLogin: true });
    if (!this.cookies['koa.sid'] || !this.cookies['koa.sid.sig']) {
      // some instances set cookie only on captcha fetch
    }

    // 2) Loop: fetch captcha then read truth from /captcha_data
    const maxAttempts = 6;
    let lastError = null;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      if (this.logger) this.logger.info({ step: 'captcha-loop', attempt }, 'login flow');
      await this._fetch(`/captcha?t=${Date.now()}`, { __skipPreLogin: true });
      const { data: cap } = await this._fetch('/captcha_data', { __skipPreLogin: true });
      let truth = '';
      if (cap && typeof cap === 'object') {
        const raw = cap.data;
        if (typeof raw === 'string') {
          try { truth = JSON.parse(raw).captcha || ''; } catch { truth = ''; }
        } else if (raw && typeof raw === 'object') {
          truth = String(raw.captcha || '');
        }
      }
      if (!truth || truth.length !== 4) { await new Promise(r => setTimeout(r, 600)); continue; }

      const payload = JSON.stringify({ email: this.email, password: this.password, captcha: truth.toLowerCase() });
      const loginRes = await this._fetch('/account/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: payload, __skipPreLogin: true });
      const lr = loginRes?.data || {};
      const dataField = lr?.data || {};
      let success = false;
      if (lr?.isOk === true) success = true;
      else if (dataField && (dataField.email || dataField.id)) success = true;

      if (success) {
        // verify authorization by hitting a restricted API
        if (this.logger) this.logger.info({ step: 'verify-auth' }, 'login flow');
        const v = await this._fetch('/repository/joined', { __skipPreLogin: true });
        if (v?.data && v.data.isOk === false && String(v.data.errMsg || '').includes('没有访问权限')) {
          // not authorized yet, retry
          await new Promise(r => setTimeout(r, 800));
          continue;
        }
        if (this.logger) this.logger.info({ step: 'login-success' }, 'login flow');
        return { status: '登录成功' };
      }

      lastError = String(lr?.errMsg || '登录失败');
      const lower = lastError.toLowerCase();
      if (this.logger) this.logger.warn({ step: 'login-retry', lastError }, 'login flow');
      if (['验证码', 'captcha', 'code', 'verify'].some(k => lower.includes(k))) { await new Promise(r => setTimeout(r, 800)); continue; }
      if (['密码','password','account','邮箱','用户'].some(k => lower.includes(k))) return { error: lastError };
      await new Promise(r => setTimeout(r, 800));
    }
    if (this.logger) this.logger.error({ step: 'login-failed' }, 'login flow');
    return { error: lastError || '登录失败(多次尝试后仍未通过验证码)' };
  }

  async getInterfaceById(interfaceId) {
    const res = await this._fetch(`/interface/get?id=${encodeURIComponent(interfaceId)}`);
    const ok = res?.data;
    if (!ok) return { error: '空响应' };
    if (ok.errMsg) return { error: ok.errMsg };
    return ok.data || ok;
  }

  async getRepositoryInterfaces(repositoryId) {
    const res = await this._fetch(`/repository/get?id=${encodeURIComponent(repositoryId)}`);
    const body = res?.data || {};
    if (body.errMsg) return { error: body.errMsg };
    const repo = body.data || {};
    const modules = Array.isArray(repo.modules) ? repo.modules : [];
    const interfaces = modules.flatMap(m => Array.isArray(m.interfaces) ? m.interfaces : []);
    return interfaces;
  }

  async searchInterfacesByKeyword(keyword, repositoryId) {
    const params = new URLSearchParams({ keyword: String(keyword || '') });
    if (repositoryId) params.set('repositoryId', String(repositoryId));
    const res = await this._fetch(`/interface/search?${params.toString()}`);
    const body = res?.data || {};
    if (body.errMsg) return { error: body.errMsg };
    return body.data || [];
  }
}


