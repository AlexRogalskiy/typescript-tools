import { Profile } from '../../typings/enum-types'
import { Optional } from '../../typings/standard-types'
import { ProfileOptions } from '../../typings/domain-types'

import { Configs } from './configs'

export namespace Profiles {
    export const getProfile = (): Optional<Profile> => {
        return process.env.NODE_ENV && Profile[process.env.NODE_ENV]
    }

    export const getProfileByEnv = (env: Optional<string> = process.env.NODE_ENV): Profile =>
        env && Profile[env] ? Profile[env] : Profile.dev

    export const getConfigByEnv = (env: Optional<string> = process.env.NODE_ENV): ProfileOptions =>
        Configs[getProfileByEnv(env)]

    export const isProd = Profile.prod === getProfile()

    export const config = isProd ? Configs[Profile.prod] : getConfigByEnv()

    export const runEnvForLanguage = (additionalRendererOptions: any): NodeJS.ProcessEnv => {
        const newEnv = Object.assign({}, process.env)
        for (const o of Object.getOwnPropertyNames(additionalRendererOptions)) {
            newEnv[`QUICKTYPE_${o.toUpperCase().replace('-', '_')}`] = additionalRendererOptions[o]
        }
        return newEnv
    }

    /**
     * Get environment variable or empty string.
     * Used for easy mocking.
     * @param key variable name
     */
    export const getEnv = (key: string): Optional<string> => {
        return process.env[key] ? process.env[key] : ''
    }
}
