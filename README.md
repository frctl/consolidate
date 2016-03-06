# Consolidate Adapter

Generic template engine adapter for [Fractal](http://frctl.github.io), powered by [consolidate.js](https://github.com/tj/consolidate.js).

If a specific Fractal template engine adapter for your desired language is available then it is recommended to **use that instead** as it will likely be easier to use and configure than this generic handler.

Currently specific template engine adapters have been implemented for:

* [Handlebars](https://github.com/frctl/handlebars-adapter)
* [Nunjucks](https://github.com/frctl/nunjucks-adapter)
* [Mustache](https://github.com/frctl/mustache-adapter)

> Note: Due to the way that Consolidate handles loading of templates, this engine cannot be used for rendering pages, only components.

## Usage

#### 1. Install the consolidate engine adapter

```shell
npm i @frctl/consolidate-adapter --save
```

#### 2. Install the template language parser

As an example, to use [Swig templates](http://paularmstrong.github.io/swig/), first you need to install Swig:

```shell
npm i swig --save
```

#### 2. Add configuration details

You then need to add the configuration details into your `fractal.js` file:

```js
var fractal = require('@frctl/fractal');

fractal.engine('consolidate', '@frctl/consolidate-adapter', {
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

fractal.engine('consolidate', '@frctl/consolidate-adapter', {
    engine: 'swig',
    instance: swig // Pass in the custom Swig instance
});
fractal.set('components.engine', 'consolidate');
fractal.set('components.ext', '.swig');
```
