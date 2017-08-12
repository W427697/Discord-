import { H1, H2, H3, H4, H5, H6, Code, P, UL, A, LI } from './components/markdown';

/*
defaultOptions should have all available options
*/
export const defaultOptions = {
  summary: null,
  inline: false,
  header: true,
  source: true,
  infoButton: false,
  propTables: [],
  propTablesExclude: null,
  styles: s => s,
  marksyConf: null,
  maxPropsIntoLine: 3,
  maxPropObjectKeys: 3,
  maxPropArrayLength: 3,
  maxPropStringLength: 50,
  sendToPanel: true,
};

export const defaultMarksyConf = {
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  code: Code,
  p: P,
  a: A,
  li: LI,
  ul: UL,
};
