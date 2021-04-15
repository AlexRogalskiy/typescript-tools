export class Cache<K, V extends { expire: number; value: V }> {
    private static SKIP_TIME = 5000

    private readonly map: Map<K, V>

    /**
     * Initialize this cache instance.
     */
    constructor() {
        this.map = new Map()
    }

    /**
     * Get the cached value of the given key.
     * @param {any} key The key to get.
     * @returns {any} The cached value or null.
     */
    get(key: K): any {
        const entry = this.map.get(key)
        const now = Date.now()

        if (entry) {
            if (entry['expire'] > now) {
                entry['expire'] = now + Cache.SKIP_TIME
                return entry['value']
            }
            this.map.delete(key)
        }
        return null
    }

    /**
     * Set the value of the given key.
     * @param {any} key The key to set.
     * @param {any} value The value to set.
     * @returns {void}
     */
    set(key: K, value: V): void {
        const entry = this.map.get(key)
        const expire = Date.now() + Cache.SKIP_TIME

        if (entry) {
            entry['value'] = value
            entry['expire'] = expire
        } else {
            // @ts-ignore
            this.map.set(key, { value, expire })
        }
    }
}
