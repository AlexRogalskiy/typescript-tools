export const TYPES = {
    boolean: 1,
    number: 2,
    string: 4,
    object: 8,
    ALL: 15,
}

const valueOrDefault = (val: any, defval: any): any => (val == null && defval != null ? defval : val)
// note: !isNaN(null) && isFinite(null) evaluates to true!!!
const isNr = (val: number): boolean => val != null && !isNaN(val) && isFinite(val)

export const toBool = {
    boolean: (val: any): boolean => val,
    number: (val: any): boolean => Boolean(val),
    string: (val: any): boolean | undefined => {
        const str = `${val}`.toLowerCase()

        return str === 'false' ? false : str === 'true' ? true : undefined
    },
    object: () => undefined,
    // object: (val) => val != null
}
const toNr = {
    boolean: (val: any): number => (val ? 1 : 0),
    number: (val: any): number | undefined => (isNr(val) ? val : undefined),
    string: (val: any): number | undefined => {
        const nr = Number(val)
        return isNr(nr) ? nr : undefined
    },
    object: () => undefined,
}
const toStr = {
    boolean: (val: any): string => `${val}`,
    number: (val: any): string => `${val}`,
    string: (val: any): string => val,
    object: (val: any): string => (val != null ? val.toString() : undefined),
}

const convert = (types: any, to: any): any => {
    return (val: any, defval: any): any => {
        const type = typeof val

        if (types.has(TYPES[type])) {
            const conv = to[type]
            val = conv ? conv(val) : undefined
        } else {
            val = undefined
        }

        return valueOrDefault(val, defval)
    }
}

const types = (): any => ({
    value: 0,

    has(type: any): boolean {
        return this.value === 0 || (this.value & type) === type
    },
    set(type: any): void {
        this.value |= type
    },
    unset(type: any): void {
        this.value &= ~type
    },
})

const update = (type: any, converter: any): any => {
    const toTypes = converter.types

    if (converter.doSet) {
        toTypes.set(type)
    } else {
        toTypes.value = toTypes.value === 0 ? TYPES.ALL : toTypes.value
        toTypes.unset(type)
    }
    converter.doSet = true

    return converter
}

export class Convert {
    protected types: any
    protected doSet: boolean
    protected toBoolean: any
    protected toNumber: any
    protected toString: any

    constructor() {
        this.types = types()
        this.doSet = true
        this.toBoolean = convert(this.types, toBool)
        this.toNumber = convert(this.types, toNr)
        this.toString = convert(this.types, toStr)
    }

    get boolean(): any {
        return update(TYPES.boolean, this)
    }

    get number(): any {
        return update(TYPES.number, this)
    }

    get object(): any {
        return update(TYPES.object, this)
    }

    get string(): any {
        return update(TYPES.string, this)
    }

    get or(): Convert {
        return this
    }

    get no(): Convert {
        this.doSet = false
        return this
    }
}
