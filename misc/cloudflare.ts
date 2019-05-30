/* eslint-disable no-console */
import Axios from 'axios';
import {readFileSync} from 'fs';

const {USE_OLD_CF_AUTH, CLOUDFLARE_AUTH_KEY, CLOUDFLARE_AUTH_EMAIL, CLOUDFLARE_BEARER, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID} = process.env;

function walkSync(currentDirPath: string, callback: { (filepath: any, stat: any): void; (arg0: any, arg1: any): void; }) {
    var fs = require('fs'),
        path = require('path');
    fs.readdirSync(currentDirPath).forEach(function (name: any) {
        var filePath = path.join(currentDirPath, name);
        var stat = fs.statSync(filePath);
        if (stat.isFile()) {
            callback(filePath, stat);
        } else if (stat.isDirectory()) {
            walkSync(filePath, callback);
        }
    });
}

// @ts-ignore
let dheaders;

if (USE_OLD_CF_AUTH) {
    dheaders = {
        'X-Auth-Key': CLOUDFLARE_AUTH_KEY,
        'X-Auth-Email': CLOUDFLARE_AUTH_EMAIL,
        'content-type': 'application/json',
        'Connection': 'close',
        'Accept': 'application/json'
    };
} else {
    dheaders = {
        'Authorization': `Bearer ${CLOUDFLARE_BEARER}`,
        'content-type': 'application/json',
        'Connection': 'close',
        'Accept': 'application/json'
    };
}

let files: { key: string; value: string; }[] = [];
walkSync(".", (filepath: string | number | Buffer | any) => {
    // @ts-ignore
    files.push({
        // fix windows paths
        key: '/' + filepath.replace('\\', '/'),
        value: readFileSync(filepath).toString('base64')
    });
});

Axios.put(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}/bulk`,
    files,
    {
        headers: dheaders,

    }).then(response => {
    console.log(response.data);
}).catch(error => {
    console.log(error.response.data.errors[0])
});

function sleep(time: number): any {
    return new Promise((resolve) => setTimeout(resolve, time));
}

sleep(1000).then(() => {
    // @ts-ignore
    Axios.get(`https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/storage/kv/namespaces/${CLOUDFLARE_KV_NAMESPACE_ID}/keys`, {headers: dheaders}).then(response => {
        console.log(response.data)
    }).catch(error => {
        console.log(error.response.data)
    });
});

