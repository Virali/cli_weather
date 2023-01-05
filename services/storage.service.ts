import { homedir } from "os";
import { join } from "path";
import { promises } from "fs";

const filePath = join(homedir(), "weather-data.json");

export const saveKeyValue = async (key: string, value: any) => {
  const newData = { [key]: value };
  const origFile = await readFile(filePath);
  let origParsed;

  if (origFile) {
    origParsed = JSON.parse(origFile.toString());
  }

  await promises.writeFile(
    filePath,
    JSON.stringify({ ...origParsed, ...newData })
  );
};

export const getKeyValue = async (key: string): Promise<string> => {
  const origFile = await readFile(filePath);

  if (origFile) {
    return JSON.parse(origFile.toString())[key];
  } else throw new Error("No file");
};

async function readFile(path: string) {
  if (await isExist(filePath)) {
    const file = await promises.readFile(path);
    return file;
  }
  return false;
}

async function isExist(path: string) {
  try {
    await promises.stat(path);
    return true;
  } catch (e) {
    return false;
  }
}
