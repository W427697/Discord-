# Addons

Storybook supports addons. You can read more about them [here](https://storybook.js.org/addons/introduction/)

There is one big difference in React Native is that it has two types of addons: Addons that work in the browser
and addons that work on the app itself (on device adons).

## Browser addons
Browser addons are default addons to storybook. You create a file called addons.js inside storybook and it is
automatically added inside your browser.

## On device addons
On device addons are addons that are displayed in your app in addons panel. You register them in a file called 
`rn-addons.js` and you also have to import `rn-addons.js` file somewhere in your entry file (it is done by default 
if you run `getstorybook` and is described in manual-setup).

## Compactibility
Addon compatibilty can be found [here](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

## Performance of on device addons
There is one big difference in performance of web addons and on device addons. Because on device addons are inside the 
app, they are also rerendered on every change.
 
## Writing the app addons
On device addons use same addon store and api as web addons. The only difference in api is that you don't have api prop 
and have to relly on channel for everything. 

The main difference between browser and app addons is that the render has to be supported by React Native (View, Text).
For more info about writing addons read [writing addons](https://storybook.js.org/addons/writing-addons/) section in 
storybook documentation.  
