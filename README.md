[![Netlify Status](https://api.netlify.com/api/v1/badges/0f011cf8-ae4f-4f4c-b810-0bf7b299d863/deploy-status)](https://app.netlify.com/sites/cloudflare-connectivity-test/deploys)

# cloudflare-test.judge.sh

Cloudflare connection test (unofficial).

## Project setup
```
npm install
```

Note: in order to get IATA code -> city name working, you will need a IATAcodes.org API key. You can populate this at build time with `npm run populate` and the API key set to the variable `IATA_KEY`.

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
