/// <reference path="../../../../lib/typings/require.d.ts"/>

window['nodeRequire'] = require;

let lib = '../../../../lib'
requirejs.config({
    shim: {
        ui: {
            exports: 'ui'
        },
        jueying: {
            exports: 'jueying',
            deps: ['dilu', 'jquery-ui', 'react', 'react-dom', 'jquery.event.drag.live']
        },
        chitu: {
            exports: 'chitu'
        },
        main: {
            deps: ['ui']
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

        react: `${lib}/react.development`,
        'react-dom': `${lib}/react-dom.development`,
    }
})

requirejs([`less!${lib}/bootstrap-3.3.7/less/bootstrap.less`])

requirejs(['main'])