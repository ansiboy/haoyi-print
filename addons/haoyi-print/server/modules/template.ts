import os = require('os')
import fs = require('fs')
import path = require('path')
import { ContentResult, contentTypes } from '../webServer';
import * as errors from '../errors';
import { readConfig } from '../config';

let encoding = 'utf8'
export async function list(): Promise<object[]> {
    let config = (await readConfig()).applicationConfig
    return new Promise<object[]>((resolve, reject) => {
        fs.readdir(config.templatePath, async function (err, files) {
            if (err) reject(err)
            let items = await Promise.all(files.map(async filename => {
                let data = await fileContent(filename)
                let obj = JSON.parse(data)//{ name: filename, data: JSON.parse(data) }
                obj.name = filename
                return obj
            }))
            resolve(items)
        })
    })
}
export async function get({ name }: { name: string }) {
    let data = await fileContent(name)
    return new ContentResult(data, contentTypes.application_json)
}
export async function save({ name, item }: { name: string, item: object }) {
    if (!name) throw errors.argumentNull('name')
    if (!item) throw errors.argumentNull('item')

    let config = (await readConfig()).applicationConfig
    let filename = path.join(config.templatePath, name)
    return new Promise((resolve, reject) => {
        fs.writeFile(filename, JSON.stringify(item), (err) => {
            if (err) {
                reject(err)
                return
            }

            resolve()
        })
    })
}
async function fileContent(name: string) {
    let config = (await readConfig()).applicationConfig
    let filename = path.join(config.templatePath, name)
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filename, encoding, (err, data) => {
            if (err) reject(err)

            resolve(data)
        })
    })
}

