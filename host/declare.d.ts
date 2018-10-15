/// <reference path="../lib/jueying.d.ts"/>

declare namespace jueying.forms {
    interface Config {
        host: {
            service_port: number,
            socket_port: number,
            bind_ip: string,
            showMainForm: boolean,
        }
    }
}
