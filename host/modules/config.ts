import { readConfig, writeConfig, Config } from "../config";
import { argumentNull } from "../errors";

export async function get() {
    let c = await readConfig()
    return c
}
export function save({ config }: { config: Config }) {
    if (!config) throw argumentNull('config')
    return writeConfig(config)
}