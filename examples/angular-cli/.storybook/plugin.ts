import { Compiler, Module } from "webpack";
import { Project } from "ts-morph";
import * as path from "path";
import { extractTypes } from "./type-generator/extract-types";

export const env = (prevEnv: any) => ({
  ...prevEnv,
  STORYBOOK_FOO: 'FOO',
});

export class TestPlugin {

  tsProject = new Project({
    tsConfigFilePath: path.resolve(__dirname, "tsconfig.json")
  });

  apply(compiler: Compiler) {
    compiler.hooks.compilation.tap("TestPlugin", (compilation) => {
      compilation.hooks.seal.tap("TestPlugin", () => {
        const types = extractTypes(this.tsProject);
        const modules: Module[] = compilation.modules;
        for (let module of modules) {

        }
      });
    });
  }

}
