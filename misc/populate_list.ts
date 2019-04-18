import Axios, { AxiosStatic } from "axios";
import {writeFileSync} from "fs";
import { Agent as HttpsAgent } from "https";
const { IATA_KEY } = process.env;

Axios.get(`https://iatacodes.org/api/v6/airports?api_key=${IATA_KEY}`, {
    httpsAgent: new HttpsAgent({ rejectUnauthorized: false })
}).then(response => {
    if (!response.data.response) {
        console.error("IATA codes returned bad/no data. Make sure the API key is still valid.");
        process.exit(1);
    }
    // transform to "code": "city name"
    let iataAsKeyValue = {};
    response.data.response.forEach(element => {
        iataAsKeyValue[element.code] = element.name;
    });
    writeFileSync("public/iata.json", JSON.stringify(iataAsKeyValue), {mode: 755, encoding: "UTF-8", flag: "w"});
});
