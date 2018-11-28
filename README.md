# Consolidate Adapter

Generic template engine adapter for [Fractal](https://fractal.build), powered by [consolidate.js](https://github.com/tj/consolidate.js).

[![NPM Version](https://img.shields.io/npm/v/@frctl/consolidate.svg?style=flat-square)](https://www.npmjs.com/package/@frctl/consolidate)

If a specific Fractal template engine adapter for your desired language is available then it is recommended to **use that instead** as it will likely be easier to use and configure than this generic handler.

Currently specific template engine adapters have been implemented for:

* [Handlebars](https://github.com/frctl/handlebars)
* [Nunjucks](https://github.com/frctl/nunjucks)
* [Mustache](https://github.com/frctl/mustache)

> Note: Due to the way that Consolidate handles loading of templates, this engine cannot be used for rendering pages, only components.

## Usage

#### 1. Install the consolidate engine adapter

```shell
npm i @frctl/consolidate --save
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

fractal.components.engine(swigAdapter);  // use the consolidate/swig adapter

fractal.components.set('ext', '.swig'); // look for files with a .swig file extension
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

fractal.components.set('ext', '.swig');
```

## Special variables

The Consolidate adapter also makes a few special variables available to your templates. They all have names prefixed with an underscore to help prevent clashes with any context data variables that are set by the user.

Note that using these may tie your templates a little more tightly into Fractal so you may choose not to use them for that reason.

The actual syntax for accessing these variables will depend on the template engine that you use - **Handlebars style** variables are shown in the examples below.

### _config

Contains the full Fractal configuration object. Useful for when you want to refer to a configuration item in your documentation (or components).

```html
{{ _config.project.title }} <!-- outputs the project title -->
{{ _config.components.ext }} <!-- outputs the extension used for components -->
```

### _self

Contains a simple data object representation of the top-level item (i.e. component or page) being rendered.

```html
{{ _self.title }} <!-- outputs 'Button' -->
```

### _target

This variable is only set in component preview layouts, and contains a simple data object representation of the item (i.e. component or page) being rendered _within_ the preview layout.

```html
{{ _target.title }} <!-- outputs 'Button' -->
```
