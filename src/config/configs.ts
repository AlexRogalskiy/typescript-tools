import { Profile } from '../../typings/enum-types'
import { ProfileOptions } from '../../typings/domain-types'

import { OUTPUT_OPTIONS } from '../constant/constants'

/**
 * ConfigRecord
 * @desc Type representing profile config options
 */
export type ConfigRecord = Record<Profile, ProfileOptions>

/**
 * Configuration options
 */
export const Configs: Readonly<ConfigRecord> = {
    dev: {
        outputOptions: OUTPUT_OPTIONS,
    },
    prod: {
        outputOptions: OUTPUT_OPTIONS,
    },
    test: {
        outputOptions: OUTPUT_OPTIONS,
    },
}
