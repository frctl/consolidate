'use strict';

var consolidate = require('consolidate');
var path        = require('path');
var _           = require('lodash');

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

    function loadViews(source) {
        for (let item of source.flatten(true)) {
            partials[item.handle] = item.viewPath;
            if (item.alias) {
                partials[item.alias] = item.viewPath;
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
                    const relPath = path.relative(tplPath, partialPath).replace('../', '');
                    const parts = path.parse(relPath);
                    if ( !_.isEmpty(parts.name) && (path.extname(tplPath) == path.extname(partialPath))) {
                        context.partials[partialKey] = path.join(parts.dir, parts.name);
                    }
                }
            });
            return Promise.resolve(consolidate[config.engine](tplPath, context));
        }
    }

};
