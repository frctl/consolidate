'use strict';

var consolidate = require('consolidate');
var path        = require('path');
var _           = require('lodash');

module.exports = {

    partials: {},

    defaults: {
        ext: '.hbs',
        name: 'handlebars'
    },

    config: null,

    configure: function(config){
        this.config = config;
    },

    /**
     * Register component view templates as partials.
     * Called every time the component file tree changes.
     */

    registerViews: function(views) {
        var self = this;
        views.forEach(function(view){
            self.partials[view.handle] = view.path;
            if (view.alias) {
                self.partials[view.alias] = view.path;
            }
        });
    },

    /**
     * Render the component view contents.
     * More work than it should be because it needs some skanky
     * partial path rewriting to make them play nicely with consolidate.
     */

    render: function(str, context, meta) {
        context.partials = {};
        var tplPath = meta.path;
        _.each(this.partials, function(partialPath, partialKey){
            if (tplPath != partialPath) {
                var relPath = path.relative(tplPath, partialPath).replace('../', '');
                var parts = path.parse(relPath);
                if ( !_.isEmpty(parts.name) && (path.extname(tplPath) == path.extname(partialPath))) {
                    context.partials[partialKey] = path.join(parts.dir, parts.name);
                }
            }
        });
        return consolidate[this.config.name](meta.path, context);
    }

};
