const path = require('path')
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    entry: {
        // game objects
        'bbcodetext': './plugins/bbcodetext.js',
        'bbcodetextplugin': './plugins/bbcodetext-plugin.js',
        'canvas': './plugins/canvas.js',
        'canvasplugin': './plugins/canvas-plugin.js',
        'gridtable': './plugins/gridtable.js',
        'gridtableplugin': './plugins/gridtable-plugin.js',
        'tagtext': './plugins/tagtext.js',
        'tagtextplugin': './plugins/tagtext-plugin.js',

        // custom file loader
        'webfontloader': './plugins/webfontloader.js',        
        'webfontloaderplugin': './plugins/webfontloader-plugin.js',

        // functions
        'xor': './plugins/xor.js',
        'xorplugin': './plugins/xor-plugin.js',
        'lzstring': './plugins/lzstring.js',
        'lzstringplugin': './plugins/lzstring-plugin.js',
        'csvtoarray': './plugins/csvtoarray.js',
        'csvtoarrayplugin': './plugins/csvtoarray-plugin.js',
        'sequence': './plugins/sequence.js',
        'sequenceplugin': './plugins/sequence-plugin.js',

        // input
        'drag': './plugins/drag.js',
        'dragplugin': './plugins/drag-plugin.js',
        'dragcursor': './plugins/dragcursor.js',
        'dragcursorplugin': './plugins/dragcursor-plugin.js',
        'dragdelta': './plugins/dragdelta.js',
        'dragdeltaplugin': './plugins/dragdelta-plugin.js',

        // member of scene 
        'clock': './plugins/clock.js',
        'clockplugin': './plugins/clock-plugin.js',

        // member of text
        'texttyping': './plugins/texttyping.js',
        'texttypingplugin': './plugins/texttyping-plugin.js',
        'textpage': './plugins/textpage.js',
        'textpageplugin': './plugins/textpage-plugin.js',
    },
    output: {
        pathinfo: true,
        path: path.resolve(__dirname, './plugins/dist'),
        filename: 'rex[name].min.js',
        library: {
            root: 'rex[name]'
        },
        libraryTarget: 'umd',
        umdNamedDefine: true,
        libraryExport: 'default'
    },
    plugins: [
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
            WEBGL_RENDERER: true,
            CANVAS_RENDERER: true
        }),
        new CleanWebpackPlugin(['./plugins/dist']),
        new UglifyJSPlugin({
            include: /\.min\.js$/,
            parallel: true,
            sourceMap: false,
            uglifyOptions: {
                compress: true,
                ie8: false,
                ecma: 5,
                output: {
                    comments: false
                },
                warnings: false
            },
            warningsFilter: (src) => false
        })
    ]
}