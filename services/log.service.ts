import chalk from "chalk";

const { bgRed, bgCyan, bgGreen } = chalk;

export const printError = (error: string) => {
  console.error(`${bgRed(" ERROR ")} - ${error}`);
};

export const printSuccess = (message: string) => {
  console.log(`${bgGreen(" SUCCESS ")} - ${message}`);
};

export const printHelp = () => {
  const text =
    "No parameters passed - weather output \n -s city assignment \n -h for help \n -t to save token";
  printInfo(" HELP ", `\n${text}`);
};

export const printInfo = (header: string, text?: string) => {
  console.log(`${bgCyan(header)} ${text}`);
};
