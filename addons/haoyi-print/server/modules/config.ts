import { readConfig, writeConfig, UserConfig } from "../config";
import { argumentNull } from "../errors";

export async function get() {
    let c = await readConfig()
    return c
}
export async function save({ config }: { config: UserConfig }) {
    if (!config) throw argumentNull('config')
    let c = await readConfig()
    c.userConfig = config
    return writeConfig(c)
}