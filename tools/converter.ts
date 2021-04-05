import { Checkers } from '../src'

import isFunction = Checkers.isFunction

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Converter {
    private static dummy = (): void => {
        // empty
    }

    static serialize(
        obj: any,
        callback: (this: any, key: string, value: any) => any = Converter.dummy,
        space = 4,
    ): string {
        callback = isFunction(callback) ? callback : Converter.dummy

        return JSON.stringify(obj, callback, space)
    }

    static deserialize(
        obj: string,
        callback: (this: any, key: string, value: any) => any = Converter.dummy,
    ): any {
        callback = isFunction(callback) ? callback : Converter.dummy

        return JSON.parse(obj, callback)
    }
}
