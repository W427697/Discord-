export interface Config {
  [name: string]: string[];
}

export interface Indentifyable {
  id: string;
}

export interface Data {
  location: string;
}

export type Item = Indentifyable & Data;
export type List = Item[];
export type FileName = string;

export interface Input {
  file: FileName;
  config: Config;
  cacheDir: string | undefined | null;
}

export interface Result {
  [id: string]: Data;
}

export interface ConfigFiles {
  [id: string]: Item;
}
