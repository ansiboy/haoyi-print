/// <reference path="../declare.d.ts"/>

import os = require('os')
import fs = require('fs')
import path = require('path')
import { ContentResult, contentTypes } from '../../../host/web-server';
import { Errors } from './errors';
import { PageDocument } from 'jueying.forms';

let encoding = 'utf8'
let templatePath = 'print-templates'
export async function list(): Promise<object[]> {
    return new Promise<object[]>((resolve, reject) => {
        fs.readdir(templatePath, async function (err, files) {
            if (err) reject(err)
            let items = await Promise.all(files.map(async filename => {
                let data = await fileContent(filename)
                let obj = JSON.parse(data)
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
export async function save({ item }: { item: PageDocument }) {
    if (!item) throw Errors.argumentNull('item')
    if (!item.name) throw Errors.fieldNull('name', 'item')

    let filename = path.join(templatePath, item.name)
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
    let filename = path.join(templatePath, name)
    return new Promise<string>((resolve, reject) => {
        fs.readFile(filename, encoding, (err, data) => {
            if (err) reject(err)

            resolve(data)
        })
    })
}

