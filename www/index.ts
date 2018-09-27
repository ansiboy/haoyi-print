(function () {

    window['nodeRequire'] = require;
    let lib = 'lib'
    requirejs.config({
        shim: {
            'jquery-ui': {
                exports: 'window["$"]',
                deps: [
                    'jquery',
                    `css!${lib}/jquery-ui-1.10.0.custom`
                ]
            },
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
                deps: ['dilu', 'jquery-ui', 'react', 'react-dom', 'jquery.event.drag.live']
            },
            chitu: {
                exports: 'chitu'
            }
        },
        paths: {
            css: `${lib}/css`,
            less: `${lib}/require-less-0.1.5/less`,
            lessc: `${lib}/require-less-0.1.5/lessc`,
            normalize: 'lib/require-less-0.1.5/normalize',

            ui: `${lib}/ui`,
            dilu: `${lib}/dilu`,
            chitu: `${lib}/chitu`,
            jueying: `${lib}/jueying`,

            electron: '../node_modules/electron/dist/resources/electron.asar/renderer/api/exports/electron',
            jquery: `https://cdn.bootcss.com/jquery/1.7.2/jquery.min`,
            'jquery-ui': `${lib}/jquery-ui`,
            'jquery.event.drag': `${lib}/jquery.event.drag-2.2`,
            'jquery.event.drag.live': `${lib}/jquery.event.drag.live-2.2`,
            qrcode: `${lib}/qrcode`,
            react: `${lib}/react.development`,
            'react-dom': `${lib}/react-dom.development`,
            rulers: `${lib}/rulers`,
        }
    });



    requirejs([`less!${lib}/bootstrap-3.3.7/less/bootstrap.less`])
    requirejs(['less!index'])
    requirejs(['react', 'react-dom', 'jquery', 'ui', 'chitu'], function (react, reactDOM, jquery) {
        (window as any)['React'] = react;
        (window as any)['ReactDOM'] = reactDOM;
        (window as any)['$'] = jquery;
        (window as any)['h'] = react.createElement;
        requirejs(['application'], function (a: any) {
            a.app.run()
        })

        define('jueying.extentions', ['jueying'], function () {
            return jueying.extentions
        })
    });


})()

