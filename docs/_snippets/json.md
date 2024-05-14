```jsonc filename="angular.json" renderer="angular" language="json"
{
  "$schema": "./node_modules/@angular/cli/lib/config/schema.json",
  "version": 1,
  "newProjectRoot": "projects",
  "projects": {
    "your-project": {
      "projectType": "application",
      "schematics": {},
      "root": "",
      "sourceRoot": "src",
      "prefix": "app",
      "architect": {
        "storybook": {
          "builder": "@storybook/angular:start-storybook",
          "options": {
            "configDir": ".storybook",
            "browserTarget": "your-project:build",
            "compodoc": true,
            "compodocArgs": [
              "-e",
              "json",
              "-d",
              "." // Add this line to introspect the relevant files starting from the root directory of your project.
            ],
            "port": 6006
          }
        },
        "build-storybook": {
          "builder": "@storybook/angular:build-storybook",
          "options": {
            "configDir": ".storybook",
            "browserTarget": "your-project:build",
            "compodoc": true,
            "compodocArgs": [
              "-e",
              "json",
              "-d",
              "." // Add this line to introspect the relevant files starting from the root directory of your project.
            ],
            "outputDir": "storybook-static"
          }
        }
      }
    }
  }
}
```

```json renderer="common" language="json"
{
  "extension": [".js", ".cjs", ".mjs", ".ts", ".tsx", ".jsx", ".vue"]
}
```

```jsonc filename="package.json" renderer="common" language="json"
{
  "imports": {
    "#api": {
      // storybook condition applies to Storybook
      "storybook": "./api.mock.ts",
      "default": "./api.ts"
    },
    "#app/actions": {
      "storybook": "./app/actions.mock.ts",
      "default": "./app/actions.ts"
    },
    "#lib/session": {
      "storybook": "./lib/session.mock.ts",
      "default": "./lib/session.ts"
    },
    "#lib/db": {
      // test condition applies to test environments *and* Storybook
      "test": "./lib/db.mock.ts",
      "default": "./lib/db.ts"
    },
    "#*": ["./*", "./*.ts", "./*.tsx"]
  }
}
```

```json renderer="react" language="json"
{
  "scripts": {
    "test": "react-scripts test --setupFiles ./setupFile.js"
  }
}
```

