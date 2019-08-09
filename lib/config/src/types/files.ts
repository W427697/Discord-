export interface Config {
  [name: string]: string[];
}

export interface Item {
  id: string;
  location: string;
}

export type FileName = string;

export interface ConfigFiles {
  [id: string]: Item;
}
