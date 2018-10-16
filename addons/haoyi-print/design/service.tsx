

import * as chitu from 'chitu';
import { PageDocument } from "jueying.forms";
import { loadConfig } from '../../../www/application'

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
        let c = await loadConfig()
        console.assert(c.host)
        console.assert(c.host.bind_ip)
        console.assert(c.host.service_port)

        return `http://${c.host.bind_ip}:${c.host.service_port}/${path}`
    }
    async documentGet(name: string) {
        let url = await this.url('document/get')
        return this.get<PageDocument>(url, { name })
    }
    async printByTemplate(templateName: string, templateData: object, deviceName: string) {
        let url = await this.url('print/printByTemplate')
        return this.postByJson(url, { templateName, templateData, deviceName })
    }
    async printers() {
        let url = await this.url('print/printers')
        return this.get<string[]>(url)
    }
    async getDefaultPrinter() {
        let url = await this.url('print/getDefaultPrinter')
        let value = await this.get<string | null>(url)
        return value || ''
    }
    async setDefaultPrinter(value: string | null) {
        let url = await this.url('print/setDefaultPrinter')
        return this.postByJson<string | null>(url, { value })
    }
    async getConfig() {
        let url = await this.url('printConfig/readConfig')
        return this.get<PrintConfig>(url)
    }
    async saveConfig(config: PrintConfig) {
        let url = await this.url('printConfig/writeConfig')
        return this.postByJson<PrintConfig>(url, { config })
    }
}