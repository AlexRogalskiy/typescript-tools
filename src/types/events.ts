import { cloneDeep, Dictionary, merge } from 'lodash'

import { Optional } from '../../typings/standard-types'

export namespace Events {
    const dictionary: Dictionary<string> = {
        created: 'created',
        deleted: 'deleted',
        updated: 'updated',
        inserted: 'inserted',
    }

    export const createEvent = <T extends keyof typeof dictionary, V extends typeof dictionary[T]>(
        eventType: T,
        body: V,
    ): Optional<V> => {
        const event = dictionary[eventType]

        if (event) {
            return merge(cloneDeep(event), body)
        }

        return null
    }
}
