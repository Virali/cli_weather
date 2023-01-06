import https from "https";
import { TOKEN_DICTIONARY } from "../helpers/constants";
import { getKeyValue } from "./storage.service";

export const getWeather = async (city: string): Promise<string> => {
  const appId = await getKeyValue(TOKEN_DICTIONARY.TOKEN);
  const url = new URL(`https://api.openweathermap.org/data/2.5/weather`);
  url.searchParams.append("appid", appId);
  url.searchParams.append("q", city);
  url.searchParams.append("units", "metric");
  url.searchParams.append("lang", "en");

  return new Promise((resolve, reject) => {
    https
      .get(url, (response) => {
        let result = "";

        response.on("data", (chunk) => {
          result += chunk;
        });

        response.on("end", () => {
          if (response.statusCode && (response.statusCode < 200 || response.statusCode > 299)) {
            reject(JSON.parse(result))
          }
          resolve(JSON.parse(result));
        });
      })
      .on("error", (error) => {
        reject(error);
      });
  });
};
