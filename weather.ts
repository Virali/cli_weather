#!/user/bin/env node

import { getArgs } from "./helpers/args";
import { TOKEN_DICTIONARY } from "./helpers/constants";
import { getWeather } from "./services/api.service";
import { printError, printHelp, printInfo, printSuccess } from "./services/log.service";
import { getKeyValue, saveKeyValue } from "./services/storage.service";

type FuncOfAny = (...args: any) => any;

type AsyncFuncOfAny = (...args: any) => Promise<any>;

interface BlockParams {
  callback: FuncOfAny | AsyncFuncOfAny;
  message?: string;
}

async function tryCatchLog(
  tryBlock: BlockParams,
  catchBlock?: Partial<BlockParams>
) {
  try {
    await tryBlock.callback();
    tryBlock?.message && printSuccess(tryBlock.message);
  } catch (err) {
    catchBlock?.callback && catchBlock.callback();
    if (err instanceof Error) {
      printError(err.message);
    }
    catchBlock?.message && printError(catchBlock.message);
  }
}

async function getForecast() {
  try {
    const cityValue = await getKeyValue(TOKEN_DICTIONARY.CITY);
    if (cityValue) {
      const weather = await getWeather(cityValue);
      console.log(weather);
    }
  } catch (error: any) {
    if (error?.cod == 404) {
      printError("Wrong city name");
      return;
    }
    if (error?.cod == 401) {
      printError("Wrong token");
      return;
    }
    printError(error.message);
  }
}

const initCLI = async () => {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
    return;
  }
  if (args.s) {
    if (typeof args.s === "boolean") {
      const cityValue = await getKeyValue(TOKEN_DICTIONARY.CITY);
      printInfo('City:', cityValue)
      return;
    }
    getWeather(args.s).then(() =>
      tryCatchLog({
        callback: () => saveKeyValue(TOKEN_DICTIONARY.CITY, args.s),
        message: "City is saved",
      })
    );
    return;
  }
  if (args.t) {
    if (typeof args.t === "boolean") {
      const tokenValue = await getKeyValue(TOKEN_DICTIONARY.TOKEN);
      printInfo('Token:', tokenValue)
      return;
    }
    tryCatchLog({
      callback: () => saveKeyValue(TOKEN_DICTIONARY.TOKEN, args.t),
      message: "Token is saved",
    });
    return;
  }
  getForecast();
};

initCLI();
