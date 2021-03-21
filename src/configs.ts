import { ConfigOptions } from '../typings/domain-types'

export namespace Configs {
    export const getApiRootURL = async <T>(setup: ConfigOptions<T>, key: string): Promise<string> => {
        const { NODE_ENV } = process.env
        const isLocalEnv = NODE_ENV === 'development'
        const options = isLocalEnv ? setup.options.dev : setup.options.prod

        if (!options[key]) {
            throw new Error(`No API end point defined for ${key}`)
        }

        return options[key]
    }
}
