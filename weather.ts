#!/user/bin/env node

import { getArgs } from "./helpers/args";
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
      callback: () => saveKeyValue("token", args.t),
      message: "Token is saved",
    });
  }
};

initCLI();
