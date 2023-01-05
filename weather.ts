#!/user/bin/env node

import { getArgs } from "./helpers/args";
import { TOKEN_DICTIONARY } from "./helpers/constants";
import { getWeather } from "./services/api.service";
import { printError, printHelp, printSuccess } from "./services/log.service";
import { saveKeyValue } from "./services/storage.service";

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
    const weather = await getWeather("saint petersburg");
    console.log(weather);
  } catch (error: any) {
    if (error?.response?.status == 404) {
      printError("Wrong city name");
      return;
    }
    if (error?.response?.status == 401) {
      printError("Wrong token");
      return;
    }
    printError(error.message);
  }
}

const initCLI = () => {
  const args = getArgs(process.argv);

  if (args.h) {
    printHelp();
  }
  if (args.s) {
    //printSuccess();
  }
  if (args.t) {
    if (typeof args.t !== "string") {
      printError("Token value is not provided");
      return;
    }
    tryCatchLog({
      callback: () => saveKeyValue(TOKEN_DICTIONARY.TOKEN, args.t),
      message: "Token is saved",
    });
  }
  getForecast();
};

initCLI();
