/* eslint-disable no-console */
import Axios from "axios";
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
    response.data.response.forEach((element: { code: string | number; name: any; }) => {
        // @ts-ignore
        iataAsKeyValue[element.code] = element.name;
    });
    writeFileSync("public/iata.json", JSON.stringify(iataAsKeyValue), {mode: 777, encoding: "UTF-8", flag: "w"});
});
