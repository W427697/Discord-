# Storybook Addon Codeinjector

Storybook Addon Codeinjector allows you dynamically add/remove (css and js) code to the component iframe [Storybook](https://storybook.js.org).

[Framework Support](https://github.com/storybooks/storybook/blob/master/ADDONS_SUPPORT.md)

![Storybook Addon Resources Demo](docs/demo.gif)

### Getting Started

```sh
yarn add -D @storybook/addon-codeinjector
```

Then create a file called `addons.js` in your storybook config.

Add following content to it:

```js
import '@storybook/addon-codeinjector/register';
```

## Usage

You can then use the code injector addon ui to dynamically add code to the iframe.

For example, to add bootstrap

```html
<link rel="stylesheet" type="text/css" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css"></link>
```

or to add jquery and use it to add a click handler.

```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
<script type="text/javascript">
  try {
    jQuery( "button" ).click(function() {
      alert( "Handler for .click() called." );
    })
  } catch(e){ }
</script>
```

#### Some things to keep in mind

* Dynamically adding/removing code won't affect any of the resources added statically (via preview-head.html).
* Code added/removed will be sticky (meaning they will persist on story changes too).
* Any javascript once loaded cannot be unloaded from a page (even if you remove and apply other code). Also in some cases (like adding event listeners on components) you might need to re-apply the javascript.
