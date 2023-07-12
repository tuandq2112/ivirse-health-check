import axios from "axios";
import dayjs from "dayjs";
import fs from "fs";
import { scheduleJob } from "node-schedule";
import path from "path";
import { fileURLToPath } from "url";
import { sendHtmlHealthCheck } from "../service/EmailService.js";
export function replaceAll(str, search, replace) {
  return str.split(search).join(replace);
}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const healthCheckHtml = fs.readFileSync(
  path.resolve(__dirname, `../html/HealthCheck.html`)
);
const domainObject = {
  WALLET: [
    { host: "https://wallet.ivirse.com", name: "Frontend wallet" },
    { host: "https://api.ivirse.com", name: "Backend community" },
    { host: "https://datahub.ivirse.com", name: "Backend datahub" },
    { host: "https://integration.ivirse.com", name: "Backend integration" },
    {
      host: "https://token-management.ivirse.com",
      name: "Backend token management & allocation",
    },
  ],
  LANDING: [
    { host: "https://ivirse.com", name: "Frontend landing page" },
    { host: "https://api.ivirse.com", name: "Backend cms wallet" },
  ],
  DEX: [
    {
      host: "https://backend-dex.ivirse.com",
      name: "Scan service",
    },
    {
      host: "https://iviswap.ivirse.com",
      name: "Front end dex",
    },
  ],
};

scheduleJob("0 * * * * *", async function () {
  const htmlData = [];
  let countDeadService = 0;
  for (const key in domainObject) {
    if (Object.hasOwnProperty.call(domainObject, key)) {
      htmlData.push(`
                    <tr>
                        <td>${key}</td>
                    </tr>`);
      const groupData = domainObject[key];

      for (const iterator of groupData) {
        let status;
        try {
          let response = await axios.get(iterator.host);
          status = response?.status;
        } catch (error) {
          status = error?.response?.status;
        }
        const alive = [200, 404].includes(status);
        if (!alive) {
          countDeadService++;
        }
        htmlData.push(`
        <tr>
            <td></td>
            <td>${iterator.name}</td>
            <td>${iterator.host}</td>
            ${
              alive
                ? `<td style="color: green; text-align: center;">V</td>`
                : `<td style="color: red; text-align: center;">X</td>`
            }
        </tr>`);
      }
    }
  }
  if (countDeadService > 0) {
    const strHtml = replaceAll(
      healthCheckHtml.toString(),
      "{$DATA_HERE}",
      htmlData.join("")
    );

    sendHtmlHealthCheck(
      "doquoctuan311@gmail.com",
      `Health check ${dayjs().format()}`,
      strHtml
    );
  }
});
