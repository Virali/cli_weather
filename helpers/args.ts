import { GenericObj } from "./types";

interface IGetArgs extends Array<string> {}

export const getArgs = (args: IGetArgs) => {
  const res: GenericObj<string, string | boolean> = {};
  const [executor, file, ...rest] = args;
  rest.forEach((item, index, array) => {
    if (item.charAt(0) === "-") {
      const nextItem: string | undefined = array[index + 1];
      let value: string | boolean = false;
      if (nextItem === undefined || nextItem.charAt(0) == "-") {
        value = true;
      } else {
        value = nextItem;
      }
      res[item.substring(1)] = value;
    }
  });

  return res;
};
