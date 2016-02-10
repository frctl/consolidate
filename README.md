# Consolidate Engine

Generic template engine handler for [Fractal](http://frctl.github.io), powered by [consolidate.js](https://github.com/tj/consolidate.js).

**This engine is currently very experimental.** If a specific Fractal template engine handler for your desired language is available then it is recommended to **use that instead of this one** as it will likely be easier to use and configure than this generic handler.

Currently specific template engine handlers have been implemented for:

* [Handlebars](https://github.com/frctl/handlebars-engine)
* [Nunjucks](https://github.com/frctl/nunjucks-engine)

> Note: Due to the way that Consolidate handles loading of templates, this engine cannot be used for rendering pages, only components.

## Usage

This engine comes pre-installed with Fractal, so there is no need to install it separately. However **you will need to install whichever template engine you want to use** via NPM.

As an example, to use Swig templates, first install swig:

```bash
npm i swig --save
```

Then add configuration details into your `fractal.js` file:

```js
const fractal = require('@frctl/fractal');

fractal.engine('consolidate', '@frctl/consolidate-engine', {
    engine: 'swig' // The template language to use
});

fractal.set('components.engine', 'consolidate'); // use the consolidate handler
fractal.set('components.ext', '.swig'); // look for files with a .swig file extension
```

You can see a full list of supported template languages on the [Consolidate documentation](https://github.com/tj/consolidate.js).

## Template Engine Instances

You can customise the [template engine instance](https://github.com/tj/consolidate.js#template-engine-instances) in your `fractal.js` file if you want to add filters, globals, mixins etc before templates are rendered.

For example, to extend the above example to use a customised instance of Swig you could do the following:

```js
const swig    = require('swig');
const fractal = require('@frctl/fractal');

// Add a custom Swig filter
swig.setFilter('join', function (input, char) {
  return input.join(char);
});

fractal.engine('consolidate', '@frctl/consolidate-engine', {
    engine: 'swig',
    instance: swig // Pass in the custom Swig instance
});
fractal.set('components.engine', 'consolidate');
fractal.set('components.ext', '.swig');
```
