#!/user/bin/env node

import { getArgs } from "./helpers/args";
import { printHelp, printSuccess } from "./services/log.service";

const initCLI = () => {
  const args = getArgs(process.argv);
  console.log('args', args);
  if(args.h) {
    printHelp();
  }
  if(args.s) {
    //printSuccess();
  }
  if(args.t) {
    
  }
}

initCLI();
