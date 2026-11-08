/**
 * In-memory Express Test Client
 * Allows end-to-end testing of Express routes, middlewares, error handlers,
 * and JSON envelopes completely in-memory without opening OS network sockets.
 */

const { EventEmitter } = require('events');

function createTestClient(app) {
  return {
    async request({ method = 'GET', url = '/', headers = {}, body = null, user = null }) {
      return new Promise((resolve, reject) => {
        const req = new EventEmitter();
        req.method = method;
        req.url = url;
        req.originalUrl = url;
        req.headers = { ...headers };
        if (body && !req.headers['content-type']) {
          req.headers['content-type'] = 'application/json';
        }
        req.body = body;
        req.user = user;
        req.query = {};
        req.params = {};

        // Parse query params if present in URL
        if (url.includes('?')) {
          const [path, queryString] = url.split('?');
          req.url = path;
          const searchParams = new URLSearchParams(queryString);
          for (const [k, v] of searchParams.entries()) {
            req.query[k] = v;
          }
        }

        const res = new EventEmitter();
        res.statusCode = 200;
        res._headers = {};
        res._data = '';

        res.status = function (code) {
          res.statusCode = code;
          return res;
        };

        res.setHeader = function (name, val) {
          res._headers[name.toLowerCase()] = val;
          return res;
        };

        res.getHeader = function (name) {
          return res._headers[name.toLowerCase()];
        };

        res.json = function (jsonObj) {
          res._headers['content-type'] = 'application/json';
          res._data = jsonObj;
          resolve({
            status: res.statusCode,
            headers: res._headers,
            body: jsonObj,
          });
          return res;
        };

        res.send = function (data) {
          res._data = data;
          resolve({
            status: res.statusCode,
            headers: res._headers,
            body: data,
          });
          return res;
        };

        res.end = function () {
          resolve({
            status: res.statusCode,
            headers: res._headers,
            body: res._data,
          });
        };

        try {
          app(req, res, (err) => {
            if (err) reject(err);
            else {
              resolve({
                status: res.statusCode,
                headers: res._headers,
                body: res._data,
              });
            }
          });
        } catch (err) {
          reject(err);
        }
      });
    },
  };
}

module.exports = { createTestClient };

