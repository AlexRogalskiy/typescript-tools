import { Profile } from '../typings/enum-types'
import { Optional } from '../typings/standard-types'
import { ProfileOptions } from '../typings/domain-types'

import { Checkers } from './checkers'

import { Configs } from './configs'

export namespace Profiles {
    import hasProperty = Checkers.hasProperty

    export const getProfile = (): Optional<Profile> => {
        return process.env.NODE_ENV && Profile[process.env.NODE_ENV]
    }

    export const isDev = Profile.dev === getProfile()

    export const getConfigByEnv = (env: Optional<string> = process.env.NODE_ENV): ProfileOptions => {
        return env && hasProperty(Configs, env) ? Configs[env] : Configs[Profile.dev]
    }

    export const getConfigByProfile = (env: Optional<Profile>): ProfileOptions => {
        return getConfigByEnv(env)
    }

    export const profile = getConfigByEnv()
}
