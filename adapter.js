'use strict';

const consolidate = require('consolidate');
const Path        = require('path');
const _           = require('lodash');

module.exports = function(source, config){

    config = _.defaults(config || {}, {
        engine: 'handlebars',
        instance: null,
    });

    if (config.instance) {
        consolidate.requires[config.engine] = config.instance;
    }

    const partials = {};
    let viewsLoaded = false;

    function loadViews() {
        for (let item of source.flattenDeep()) {
            partials['@' + item.handle] = item.viewPath;
            if (item.alias) {
                partials['@' + item.alias] = item.viewPath;
            }
        }
        viewsLoaded = true;
    }

    source.on('loaded', loadViews);
    source.on('changed', loadViews);

    return {
        engine:  consolidate[config.engine],
        requires: consolidate.requires,
        render: function(tplPath, str, context, meta){
            if (!viewsLoaded) loadViews(source);
            context.partials = {};
            _.each(partials, function(partialPath, partialKey){
                if (tplPath != partialPath) {
                    const relPath = Path.relative(tplPath, partialPath).replace('../', '');
                    const parts = Path.parse(relPath);
                    if ( !_.isEmpty(parts.name) && (Path.extname(tplPath) == Path.extname(partialPath))) {
                        context.partials[partialKey] = Path.join(parts.dir, parts.name);
                    }
                }
            });
            return Promise.resolve(consolidate[config.engine](tplPath, context));
        }
    }

};
