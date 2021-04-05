import { Networks } from '../src'

import getQueryParams = Networks.getQueryParams

export class Url {
    static isUrl(value: any): boolean {
        return value instanceof Url
    }

    static from(protocol: string, domain: string, queryParams = {}): Url {
        return new Url(protocol, domain, queryParams)
    }

    static Url(value: Url): Url {
        return new Url(value.protocol, value.domain, value.params)
    }

    constructor(
        readonly protocol: string,
        readonly domain: string,
        readonly params: { [index: string]: string } = {},
    ) {
        this.protocol = protocol
        this.domain = domain
        this.params = params || {}
    }

    paramsToString(): string {
        return getQueryParams(this.params)
    }

    toString(): string {
        return `${this.protocol}://${this.domain}${this.paramsToString()}`
    }

    addParam(name: string, value: any): Url {
        this.params[name] = value

        return this
    }
}
