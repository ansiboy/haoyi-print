
/// <reference path="../../../../lib/typings/require.d.ts"/>
/// <reference path="../../../../lib/jueying.d.ts"/>

(function () {

    window['nodeRequire'] = require;
    let lib = '../../../../lib'
    requirejs.config({
        shim: {
            'jquery.event.drag': {
                exports: 'window["$"]',
                deps: [
                    'jquery'
                ]
            },
            'jquery.event.drag.live': {
                deps: [
                    'jquery',
                    'jquery.event.drag'
                ]
            },
            qrcode: {
                exports: 'QRCode'
            },
            ui: {
                exports: 'ui'
            },
            jueying: {
                exports: 'jueying',
                deps: ['dilu', 'react', 'react-dom', 'jquery.event.drag.live']
            },
            chitu: {
                exports: 'chitu'
            }
        },
        paths: {
            css: `${lib}/css`,
            text: `${lib}/text`,
            less: `${lib}/require-less-0.1.5/less`,
            lessc: `${lib}/require-less-0.1.5/lessc`,
            normalize: `${lib}/require-less-0.1.5/normalize`,

            ui: `${lib}/ui`,
            dilu: `${lib}/dilu`,
            chitu: `${lib}/chitu`,
            jueying: `${lib}/jueying`,

            electron: '../node_modules/electron/dist/resources/electron.asar/renderer/api/exports/electron',
            jquery: `https://cdn.bootcss.com/jquery/1.7.2/jquery.min`,
            'jquery.event.drag': `${lib}/jquery.event.drag-2.2`,
            'jquery.event.drag.live': `${lib}/jquery.event.drag.live-2.2`,

            empty: `${lib}/jsondiffpatch/dist/empty`,
            jsondiffpatch: `${lib}/jsondiffpatch/dist/jsondiffpatch.umd`,
            qrcode: `${lib}/qrcode`,
            react: `${lib}/react.development`,
            'react-dom': `${lib}/react-dom.development`,
            rulers: `${lib}/rulers`,

            components: `addons/haoyi-print/components`,
        }
    });

    require['nodeRequire'] = window['nodeRequire']
    requirejs(['react', 'react-dom', 'jquery', 'jsondiffpatch', 'ui', 'chitu'], function (react, reactDOM, jquery, jsondiffpatch) {

        (window as any)['React'] = react;
        (window as any)['ReactDOM'] = reactDOM;
        (window as any)['$'] = jquery;
        (window as any)['h'] = react.createElement;
        (window as any)['jsondiffpatch'] = jsondiffpatch;

        define('jueying.forms', ['jueying'], function () {
            return jueying.forms
        })

        if (!location.hash)
            requirejs(['./main'])
        else
            requirejs([`./${location.hash.substr(1)}`])
    });

})()

