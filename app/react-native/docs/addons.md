# Addons

Storybook supports addons. You can read more about them [here](https://storybook.js.org/addons/introduction/)

There is one big difference in React Native is that it has two types of addons: Addons that work in the browser
and addons that work on the app itself.

## Browser addons
Browser addons are default addons to storybook. You create a file called addons.js inside storybook and it is automatically
added inside your browser.

## App addons
App addons are addons that are displayed in your app in addons panel. You register them in a file called rn-addon.js and you also
have to import rn-addons.js file somewhere in your entry file (it is done by default if you run getstorybook and is described in manual-setup).

## Compactibility
Addon compatibilty can be found [here](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

## Performance of app addons
There is one big difference in performance of web addons and app addons. Because app addons are inside the app, they are
also rerendered on every change. If you feel any performance implications, this may be a cause.
 
If you are writing your own addon there is a possibility to get cannotUpdate during render error. That is because you are updating state
while a rerender is already happening. One of the solutions for that is to avoid using state altogether.

## Writing the app addons
App addons have same api as browser addons except currently api prop is not supported in React Native (you can use channel for most problems).  

The main difference between browser and app addons is that the render has to be supported by React Native (View, Text).
That means that if you rewrite browser addon render to support react native it should most likely work.
