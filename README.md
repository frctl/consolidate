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

You then need to configure Fractal to use Swig via the Consolidate adapter:

```js

const consolidate = require('@frctl/consolidate');
const swigAdapter = consolidate('swig');

fractal.engine(swigAdapter);  // use the consolidate/swig adapter

fractal.set('components.ext', '.swig'); // look for files with a .swig file extension
```

You can see a full list of supported template languages on the [Consolidate documentation](https://github.com/tj/consolidate.js).

## Template Engine Instances

You can customise the [template engine instance](https://github.com/tj/consolidate.js#template-engine-instances) once it has been if you want to add filters, globals, mixins etc.

For example, to extend the above example to use a customised instance of Swig you could do the following:

```js
const swig        = require('swig');
const consolidate = require('@frctl/consolidate');

// Add a custom Swig filter
swig.setFilter('join', function (input, char) {
    return input.join(char);
});

const swigAdapter = consolidate('swig', swig); // pass in the customised swig instance to use instead of the default one

fractal.components.engine(swigAdapter); // set it to use as the template engine for components

fractal.set('components.ext', '.swig');
```
