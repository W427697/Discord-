import { addBuilderToAngularJsonProject } from './angular-helpers';

const angularJsonSource = `// Comment
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "yarn"
  },
  "newProjectRoot": "projects",
  "projects": {
    "angular-v14": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/angular-v14",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {},
            "development": {}
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "angular-v14:build:production"
            },
            "development": {
              "browserTarget": "angular-v14:build:development"
            }
          },
          "defaultConfiguration": "development"
        }
      }
    }
  }
}
`;

const angularJsonSourceWithScriptsInDefault = `// Comment
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "cli": {
    "packageManager": "yarn"
  },
  "newProjectRoot": "projects",
  "projects": {
    "angular-v14": {
      "projectType": "application",
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:browser",
          "options": {
            "outputPath": "dist/angular-v14",
            "index": "src/index.html",
            "main": "src/main.ts",
            "polyfills": "src/polyfills.ts",
            "tsConfig": "tsconfig.app.json",
            "inlineStyleLanguage": "scss",
            "assets": [
              "src/favicon.ico",
              "src/assets"
            ],
            "styles": [
              "src/styles.scss"
            ],
            "scripts": []
          },
          "configurations": {
            "production": {},
            "development": {}
          },
          "defaultConfiguration": "production"
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "configurations": {
            "production": {
              "browserTarget": "angular-v14:build:production"
            },
            "development": {
              "browserTarget": "angular-v14:build:development"
            }
          },
          "defaultConfiguration": "development"
        },
        "storybook": {
          "builder": "@storybook/angular:start-storybook",
          "options": {
            "browserTarget": "angular-v14:build",
            "port": 6006
          }
        },
        "build-storybook": {
          "builder": "@storybook/angular:build-storybook",
          "options": {
            "browserTarget": "angular-v14:build"
          }
        }
      }
    }
  }
}
`;

describe('AngularHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('addBuilderToAngularJsonProject', () => {
    it(`should add builder to default project`, () => {
      const source = addBuilderToAngularJsonProject(angularJsonSource, 'angular-v14');
      expect(source).toBe(angularJsonSourceWithScriptsInDefault);
    });
  });
});
