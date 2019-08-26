"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-console */
var axios_1 = __importDefault(require("axios"));
var fs_1 = require("fs");
var _a = process.env, USE_OLD_CF_AUTH = _a.USE_OLD_CF_AUTH, CLOUDFLARE_AUTH_KEY = _a.CLOUDFLARE_AUTH_KEY, CLOUDFLARE_AUTH_EMAIL = _a.CLOUDFLARE_AUTH_EMAIL, CLOUDFLARE_BEARER = _a.CLOUDFLARE_BEARER, CLOUDFLARE_ACCOUNT_ID = _a.CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID = _a.CLOUDFLARE_KV_NAMESPACE_ID;
function walkSync(currentDirPath, callback) {
    var fs = require('fs'), path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        }
        else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}
// @ts-ignore
var dheaders;
if (USE_OLD_CF_AUTH) {
    dheaders = {
        'X-Auth-Key': CLOUDFLARE_AUTH_KEY,
        'X-Auth-Email': CLOUDFLARE_AUTH_EMAIL,
        'content-type': 'application/json',
        'Connection': 'close',
        'Accept': 'application/json'
    };
}
else {
    dheaders = {
        'Authorization': "Bearer " + CLOUDFLARE_BEARER,
        'content-type': 'application/json',
        'Connection': 'close',
        'Accept': 'application/json'
    };
}
var files = [];
walkSync(".", function (filepath) {
    // @ts-ignore
    files.push({
        // fix windows paths
        key: '/' + filepath.replace('\\', '/'),
        value: fs_1.readFileSync(filepath).toString('base64')
    });
});
axios_1.default.put("https://api.cloudflare.com/client/v4/accounts/" + CLOUDFLARE_ACCOUNT_ID + "/storage/kv/namespaces/" + CLOUDFLARE_KV_NAMESPACE_ID + "/bulk", files, {
    headers: dheaders,
}).then(function (response) {
    console.log(response.data);
}).catch(function (error) {
    console.log(error.response.data.errors[0]);
});
function sleep(time) {
    return new Promise(function (resolve) { return setTimeout(resolve, time); });
}
sleep(1000).then(function () {
    // @ts-ignore
    axios_1.default.get("https://api.cloudflare.com/client/v4/accounts/" + CLOUDFLARE_ACCOUNT_ID + "/storage/kv/namespaces/" + CLOUDFLARE_KV_NAMESPACE_ID + "/keys", { headers: dheaders }).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.log(error.response.data);
    });
});
