# Storybook Transforms

TODO

### config resolution

1. Find all refs (subConfigs / presets+addons) files
2. Create an empty new file (collector)
3. Load each file
   3.1. parse
   3.2. remove refs to subConfigs
   3.3. copy named exports into a named export into the collector
   3.4. copy scope of named exports into the collector
4. Shake the collector of unused imports & variables
5. Generate new source