'use strict';

module.exports = function(lasso, config) {
    var markoCompiler = config.compiler || require('marko/compiler');

    var defaultOutput = markoCompiler.isVDOMSupported ? 'vdom' : 'html';

    var compilerOptions = {
        output: config.output || defaultOutput
    };

    lasso.dependencies.registerRequireType(
        'marko',
        {
            properties: {
                'path': 'string'
            },

            init: function(lassoContext, callback) {
                if (!this.path) {
                    return callback(new Error('"path" is required for a Marko dependency'));
                }

                this.path = this.resolvePath(this.path);

                if (markoCompiler.compileFileForBrowser) {
                    this._compiled = markoCompiler.compileFileForBrowser(this.path, compilerOptions);
                } else {
                    var code = markoCompiler.compileFile(this.path, compilerOptions);
                    this._compiled = {
                        code: code
                    };
                }

                callback();
            },

            getDependencies: function(lassoContext) {
                return this._compiled.dependencies || [];
            },

            read: function(lassoContext) {
                return this._compiled.code || null;
            },

            getLastModified: function(lassoContext, callback) {
                markoCompiler.getLastModified(this.path, callback);
            }
        });
};
