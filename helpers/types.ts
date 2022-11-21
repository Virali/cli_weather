export type GenericObj<K extends string | number | symbol, V> = {
  [key in K]: V;
};