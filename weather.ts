#!/user/bin/env node

import { getArgs } from "./helpers/args";

const initCLI = () => {
  const args = getArgs(process.argv);
  console.log('args', args);
}

initCLI();
