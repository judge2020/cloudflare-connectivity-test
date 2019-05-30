[![Netlify Status](https://api.netlify.com/api/v1/badges/0f011cf8-ae4f-4f4c-b810-0bf7b299d863/deploy-status)](https://app.netlify.com/sites/cloudflare-connectivity-test/deploys)

# cloudflare connectivity test (worker)

Cloudflare connection test (unofficial). This is meant to be a Cloudflare-hosted setup by storing files in workers KV.

**This is a concept.** I do not plan to make this a maintained library or solution to hosting things on Cloudflare long-term.

### Setup

(`npm install` first)


Note: in order to get IATA code lookups working, you will need a IATAcodes.org API key. You can populate this at build time with `npm run populate` and the API key set to the variable `IATA_KEY`.


1. copy .env.example to .env and fill in all of the relevant values (`CLOUDFLARE_BEARER` should be blank for now)
2. run `node_modules/.bin/cross-dotenv serverless deploy` to deploy the worker script.


### Publish flow

1. build your files needed (`npm run build`)
1. populate IATA codes (`npm run populate`)
2. upload to the KV namespace (`npm run upload`)


### Limitations

* maximum file size is 2mb (after base64 encoding)
* may not handle edge cases



Potential improvements:
* cache API (or global variables) for the pulled files
* storing bigger files by splitting the encoded string into multiple K/V variables.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
