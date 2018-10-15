

import * as chitu from 'chitu';
import { PageDocument, Config } from "jueying.forms";
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
        return `http://${c.host.bind_ip}:${c.host.service_port}/${path}`
    }
    async templateList() {
        let url = await this.url('template/list')
        return this.get<PageDocument[]>(url)
    }
    async templateGet(name: string) {
        let url = await this.url('template/get')
        return this.get<PageDocument>(url, { name })
    }
    async templateSave(name: string, data: PageDocument) {
        let url = await this.url('template/save')
        return this.postByJson(url, { name, item: data })
    }
    async printTaskRemove(id: string) {
        let url = await this.url('printTask/remove')
        return this.postByJson(url, { id })
    }
    async printTaskCreate(templateName: string, templateData: object) {
        let url = await this.url('printTask/create')
        return this.postByJson(url, { templateName, templateData })
    }
    async print(deviceName: string, html: string) {
        let url = await this.url('print/print')
        return this.postByJson(url, { deviceName, html })
    }
    async printByTemplate(templateName: string, templateData: object) {
        let url = await this.url('print/printByTemplate')
        return this.postByJson(url, { templateName, templateData })
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
        let url = await this.url('printConfig/get')
        return this.get<PrintConfig>(url)
    }
    async saveConfig(config) {
        let url = await this.url('printConfig/save')
        return this.postByJson<PrintConfig>(url, { config })
    }
}