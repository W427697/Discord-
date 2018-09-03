# Storybook server
The default usage of React native storybook till version 5 involved starting storybook server.

The reason it has changed is that in most cases it is not really necessary.
If you want to to use server you still simply call `npm run storybook` script in your app.

## Benefits of storybook server

* ### Websockets connection
The main benefit you get from running storybook server is that your app will be listening for websockets.
That means that you can create your own tools that integrate with your storybook app.

* ### Story selection
Having server running allows you to control your storybook view from inside web page or your ide.

There is a plugin for [JetBrains IDEs](https://plugins.jetbrains.com/plugin/9910-storybook) and there is one 
for [VS Code](https://github.com/orta/vscode-react-native-storybooks)


* ### Web addons
There are addons that work on React Native but don't have on device implementation yet.


