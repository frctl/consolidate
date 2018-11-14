'use strict';

const consolidate = require('consolidate');
const Path        = require('path');
const _           = require('lodash');
const Adapter     = require('@frctl/fractal').Adapter;

class ConsolidateAdapter extends Adapter {

    constructor(engineName, instance, source, app) {
        if (instance) {
            consolidate.requires[engineName] = instance;
        }
        super(instance || require(engineName), source);
        this._engineName = engineName;
        this._app = app;
    }

    get engine() {
        return this._engine;
    }

    render(tplPath, str, context, meta) {
        meta = meta || {};
        setEnv('_self', meta.self, context);
        setEnv('_target', meta.target, context);
        setEnv('_env', meta.env, context);
        setEnv('_config', this._app.config(), context);
        context.partials = {};
        _.each(this._views, function(view){
            if (tplPath != view.path) {
                const relPath = Path.relative(tplPath, view.path).replace('..' + Path.sep, '');
                const parts = Path.parse(relPath);
                if ( !_.isEmpty(parts.name) && (Path.extname(tplPath) == Path.extname(view.path))) {
                    context.partials[view.handle] = Path.join(parts.dir, parts.name);
                }
            }
        });
        return Promise.resolve(consolidate[this._engineName](tplPath, context));
    }

}

function setEnv(key, value, context) {
    if (_.isUndefined(context[key]) && ! _.isUndefined(value)) {
        context[key] = value;
    }
}

module.exports = function(engineName, instance) {

    return {

        register(source, app) {

            return new ConsolidateAdapter(engineName, instance, source, app);

        }
    }

};

module.exports.consolidate = consolidate;
