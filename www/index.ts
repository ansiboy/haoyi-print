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
            qrcode: {
                exports: 'QRCode'
            },
            ui: {
                exports: 'ui'
            },
            jueying: {
                exports: 'jueying',
                deps: ['dilu', 'jquery-ui', 'react', 'react-dom']
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
            jquery: `${lib}/jquery-2.1.3`,
            'jquery-ui': `${lib}/jquery-ui`,
            qrcode: `${lib}/qrcode`,
            react: `${lib}/react.development`,
            'react-dom': `${lib}/react-dom.development`,
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

