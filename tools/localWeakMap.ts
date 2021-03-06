import { Optional } from '../typings/standard-types'

export default class LocalWeakMap<K, V> {
    private weakMap: WeakMap<Record<string, unknown>, V>
    private map: Map<K, V>

    constructor() {
        this.weakMap = new WeakMap()
        this.map = new Map()
    }

    set(key: K, value: V): void {
        if (typeof key === 'object') {
            this.weakMap.set(key as unknown as Record<string, unknown>, value)
        } else {
            this.map.set(key, value)
        }
    }

    get(key: K): Optional<V> {
        if (typeof key === 'object') {
            return this.weakMap.get(key as unknown as Record<string, unknown>)
        }

        return this.map.get(key)
    }

    has(key: K): boolean {
        if (typeof key === 'object') {
            return this.weakMap.has(key as unknown as Record<string, unknown>)
        }

        return this.map.has(key)
    }
}
