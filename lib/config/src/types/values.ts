import { Express } from 'express';
import https from 'https';
import http from 'http';
import { Configuration as Webpack } from 'webpack';

export type LogLevel = 'silly' | 'verbose' | 'info' | 'warn' | 'error' | 'silent';

export interface Output {
  location?: string;
  compress?: boolean;
  preview?: boolean | string;
}

export { Webpack };

export type Middleware = (app: Express, server?: http.Server | https.Server) => Promise<void>;

export interface Static {
  [route: string]: string;
}

export interface Server {
  port: number;
  host: string;
  devPorts: {
    manager: number;
    preview: number;
  };
  ssl?: {
    ca: string[];
    cert: string;
    key: string;
  };
  middleware?: Middleware | Middleware[];
  static?: Static[];
}

export type Template = string;

export type Entries = string[];
