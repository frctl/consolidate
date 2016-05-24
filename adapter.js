'use strict';

const consolidate = require('consolidate');
const Path        = require('path');
const _           = require('lodash');
const Adapter     = require('@frctl/fractal').Adapter;

class ConsolidateAdapter extends Adapter {

    constructor(engineName, instance, source) {
        super(consolidate[engineName], source);
        this._engineName = engineName;
        if (instance) {
            consolidate.requires[this._engineName] = instance;
        }
    }

    get engine() {
        return this._engine;
    }

    render(tplPath, str, context, meta) {
        context.partials = {};
        _.each(this._views, function(view){
            if (tplPath != view.path) {
                const relPath = Path.relative(tplPath, view.path).replace('../', '');
                const parts = Path.parse(relPath);
                if ( !_.isEmpty(parts.name) && (Path.extname(tplPath) == Path.extname(view.path))) {
                    context.partials[view.handle] = Path.join(parts.dir, parts.name);
                }
            }
        });
        return Promise.resolve(this.engine(tplPath, context));
    }

}

module.exports = function(engineName, instance) {

    return {

        register(source, app) {

            return new ConsolidateAdapter(engineName, instance, source);

        }
    }

};

module.exports.consolidate = consolidate;
