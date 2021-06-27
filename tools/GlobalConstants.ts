import path from 'path'

declare const _VERSION_: string | undefined
declare const _ROOT_URI_: string | undefined

export const GlobalConstants = {
    get version(): string | undefined {
        return _VERSION_
    },

    get rootURI(): string {
        const defaultURI = '/'

        if (_ROOT_URI_ === '{ROOT_URI}') {
            return defaultURI
        }
        return path.join(_ROOT_URI_ ?? defaultURI, '/')
    },

    get serviceURI(): string {
        return path.join(this.rootURI, 'api')
    },

    absoluteRootUrl(...parts: string[]): string {
        return path.join(this.rootURI, ...parts)
    },

    absoluteServiceUrl(...parts: string[]): string {
        return path.join(this.serviceURI, ...parts)
    },

    absoluteUrl(...parts: string[]): string {
        if (parts[0].startsWith('platform:')) {
            return this.absoluteServiceUrl('images', ...parts)
        }

        return this.absoluteRootUrl(...parts)
    },
}
