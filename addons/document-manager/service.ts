

import * as chitu from 'chitu';
import { PageDocument } from "jueying.forms";
import { loadConfig } from '../../www/application'

export class Service extends chitu.Service {


    get<T>(url: string, data?: { [key: string]: any }) {
        data = data || {};
        let params = "";
        for (let key in data) {
            params = params ? `${params}&${key}=${data[key]}` : `${key}=${data[key]}`;
        }

        if (params) {
            url = `${url}?${params}`;
        }

        return this.ajax<T>(url, { method: 'get' })
    }
    postByJson<T>(url: string, data?: any) {
        let headers = { "content-type": 'application/json' };
        return this.ajax<T>(url, { headers, data, method: 'post' });
    }
    private async url(path: string): Promise<string> {
        let config = await loadConfig()
        console.assert(config)
        console.assert(config.host)
        console.assert(config.host.service_port)
        console.assert(config.host.bind_ip)

        return `http://${config.host.bind_ip}:${config.host.service_port}/${path}`
    }
    async documentList() {
        let url = await this.url('document/list')
        return this.get<PageDocument[]>(url)
    }
    async documentGet(name: string) {
        let url = await this.url('document/get')
        return this.get<PageDocument>(url, { name })
    }
    async documentSave(data: PageDocument) {
        let url = await this.url('document/save')
        return this.postByJson(url, { item: data })
    }
    // async printTaskRemove(id: string) {
    //     let url = await this.url('printTask/remove')
    //     return this.postByJson(url, { id })
    // }
    // async printTaskCreate(templateName: string, templateData: object) {
    //     let url = await this.url('printTask/create')
    //     return this.postByJson(url, { templateName, templateData })
    // }
    // async print(deviceName: string, html: string) {
    //     let url = await this.url('print/print')
    //     return this.postByJson(url, { deviceName, html })
    // }
    // async printByTemplate(templateName: string, templateData: object) {
    //     let url = await this.url('print/printByTemplate')
    //     return this.postByJson(url, { templateName, templateData })
    // }
    // async printers() {
    //     let url = await this.url('print/printers')
    //     return this.get<string[]>(url)
    // }
    // async getDefaultPrinter() {
    //     let url = await this.url('print/getDefaultPrinter')
    //     let value = await this.get<string | null>(url)
    //     return value || ''
    // }
    // async setDefaultPrinter(value: string | null) {
    //     let url = await this.url('print/setDefaultPrinter')
    //     return this.postByJson<string | null>(url, { value })
    // }

}