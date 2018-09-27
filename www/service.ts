/// <reference path="../host/modules/printTask.ts"/>
/// <reference path="../host/modules/config.ts"/>

import { ComponentData } from "jueying";
import * as chitu from 'chitu';
import { PrintTask } from "../host/modules/printTask";
import { UserConfig } from "../host/config";


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
    private url(path: string) {
        return `http://localhost:52894/${path}`
    }
    templateList() {
        let url = this.url('template/list')
        return this.get<{ name: string, data: ComponentData }[]>(url)
    }
    templateGet(name: string) {
        let url = this.url('template/get')
        return this.get<ComponentData>(url, { name })
    }
    templateSave(name: string, data: ComponentData) {
        let url = this.url('template/save')
        return this.postByJson(url, { name, item: data })
    }
    printTaskFirst() {
        let url = this.url('printTask/first')
        return this.get<PrintTask>(url)
    }
    printTaskRemove(id: string) {
        let url = this.url('printTask/remove')
        return this.postByJson(url, { id })
    }
    printTaskCreate(templateName: string, templateData: object) {
        let url = this.url('printTask/create')
        return this.postByJson(url, { templateName, templateData })
    }
    print(deviceName: string, html: string) {
        let url = this.url('print/print')
        return this.postByJson(url, { deviceName, html })
    }
    printByTemplate(templateName: string, templateData: object) {
        let url = this.url('print/printByTemplate')
        return this.postByJson(url, { templateName, templateData })
    }
    printers() {
        let url = this.url('print/printers')
        return this.get<string[]>(url)
    }
    async getDefaultPrinter() {
        let url = this.url('print/getDefaultPrinter')
        let value = await this.get<string | null>(url)
        return value || ''
    }
    setDefaultPrinter(value: string | null) {
        let url = this.url('print/setDefaultPrinter')
        return this.postByJson<string | null>(url, { value })
    }
    getConfig() {
        let url = this.url('config/get')
        return this.get<UserConfig>(url)
    }
    saveConfig(config) {
        let url = this.url('config/save')
        return this.postByJson<UserConfig>(url, { config })
    }

    ui = {
        maxMainWindow: () => {
            let url = this.url('ui/maxMainWindow')
            return this.postByJson(url, {})
        },
        minMainWindow: () => {
            let url = this.url('ui/minMainWindow')
            return this.postByJson(url, {})
        },
        getMainWindowPosition: () => {
            return this.get<number[]>('ui/getMainWindowPosition')
        },
        setMainWindowPosition: (x: number, y: number) => {
            return this.postByJson('ui/setMainWindowPosition', { x, y })
        },
        exists: () => {
            return this.postByJson('ui/exists')
        }
    }
}