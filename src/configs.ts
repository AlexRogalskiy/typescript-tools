import { ConfigOptions } from '../typings/types'

export const getApiRootURL = async (setup: ConfigOptions, key: string): Promise<string> => {
    const { NODE_ENV } = process.env
    const isLocalEnv = NODE_ENV === 'development'
    const options = isLocalEnv ? setup.options.dev : setup.options.prod
    if (!options[key]) throw new Error(`No API end point defined for ${key}`)

    return options[key]
}
