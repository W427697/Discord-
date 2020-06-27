/* eslint-disable no-console */
import 'reflect-metadata';
import 'zone.js/dist/zone';
import 'zone.js/dist/zone-error';
import { document } from 'global';
import { NgModule, NgModuleRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import React from 'react';

const defaultPassProps = (props: any) => props;

export const SELECTOR = 'app-root';

const bootstrapAngularApp = (
  node: HTMLElement,
  AppComponentInstance: any
): Promise<NgModuleRef<any>> => {
  node.appendChild(document.createElement(SELECTOR));
  const AppModule = NgModule({
    declarations: [AppComponentInstance],
    imports: [BrowserModule],
    bootstrap: [AppComponentInstance],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
  })(class {});
  return platformBrowserDynamic().bootstrapModule(AppModule);
};

export default (Component: any, { passProps = defaultPassProps } = {}) => {
  console.log('debugging... trying to display: ', Component);
  return (props: any) => {
    console.log('debugging... Executing function with props', props);
    const el = React.useRef(null);

    React.useEffect(() => {
      console.log('debugging... Executing useEffect with el', el);
      let module: any;
      // eslint-disable-next-line no-return-assign
      bootstrapAngularApp(el.current, Component).then((m) => (module = m));
      // eslint-disable-next-line consistent-return
      return () => {
        while (!module) {
          // eslint-disable-next-line no-continue
          continue;
        }
        console.log('debugging... Destroy.', el);
        module.destroy();
      };
    });
    console.log('debugging... createElement', el);
    return React.createElement('div', null, React.createElement('div', { ref: el }));
  };
};
