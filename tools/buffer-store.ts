import { Strings } from '../src'

import randomString = Strings.randomString

// eslint-disable-next-line @typescript-eslint/ban-types
class TypedStore<K extends object, V> {
    private readonly _type
    private readonly _storage

    constructor(type) {
        this._type = type
        this._storage = new WeakMap<K, V>()

        Object.freeze(this)
    }

    get(key: K): V {
        return this._storage.get(key)
    }

    store(value: V): K {
        const { _type, _storage } = this
        if (!(value instanceof _type)) {
            throw new Error('Invalid argument buffer')
        }

        const key = Object.freeze({ key: randomString() })
        _storage.set(key, value)

        return _storage.get(key)
    }

    remove(key: K): void {
        this._storage.delete(key)
    }
}

export default new TypedStore<any, ArrayBuffer>(ArrayBuffer)
