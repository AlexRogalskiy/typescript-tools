import { sha1 } from 'object-hash'

import { Objects, Checkers, CommonUtils } from '..'

export namespace Commons {
    import hasProperty = Checkers.hasProperty
    import isFunction = Checkers.isFunction

    import defineProperty = CommonUtils.defineProperty
    import defineStaticProperty = CommonUtils.defineStaticProperty

    const WINDOW_USER_SCRIPT_VARIABLE = '__USER__'

    const { hasOwnProperty: hasOwnProp } = Object.prototype

    // @ts-ignore
    ;(() => {
        const props = {
            proto: {
                equals: 'eqTo',
                compare: 'cmpTo',
            },
            static: {
                equals: '__equals__',
                compare: '__compare__',
            },
        }

        // Compares Primitive objects
        const computePrimitiveEquals = (objA: any, objB: any): boolean => {
            return objA === objB
        }

        // Compares Date objects by their time
        const computeDateEquals = (objA: any, objB: any): boolean => {
            return objA instanceof Date && objB instanceof Date && objA.getTime() === objB.getTime()
        }

        // Compares Object types by their Hash code and Properties
        const computeObjectEquals = (objA: any, objB: any): boolean => {
            if (typeof objA === 'object' && typeof objB === 'object') {
                if (sha1(objA, true) !== sha1(objB, true)) {
                    return false
                }

                /// Process equality for object literals:
                /// object literals may have equal hash code, we process equality by each property.
                /// regular "class" instances have different hash code, hence do not fall into following code.
                /// object objA is direct descendant of Object hence no need to check "hasOwnProperty"

                let _val

                for (const _prop in objA) {
                    if (hasProperty(objA, _prop)) {
                        _val = objA[_prop]

                        /// Object methods are not considered for equality
                        if (typeof _val === 'function') {
                            continue
                        }

                        if (hasProperty(objB, _prop)) {
                            if (!computeEquals(_val, objB[_prop], true)) {
                                return false
                            }
                        }
                    }

                    /// no need to browse objB properties, all properties of objA is checked against objB
                    /// it is very unlikely for object literals with the same hash code to have different properties
                    /// even in such a rare case, objects are considered equal

                    return true
                }
            }

            // Objects are equal (with auto type conversion)
            // Objects from the same type are considered equal (eg. new Number(1) and 1)
            return objA === objB
        }

        /**
         * Determines whether the specified object instances are considered equal.
         * @param {Object} objA The first object to compare.
         * @param {Object} objB The second object to compare.
         * @param {Boolean} override When true, uses the overridden __equals__ function if it is defined.
         * @returns {Boolean}
         */
        const computeEquals = (objA, objB, override): boolean => {
            // Objects are identical (including null)
            if (objA === objB) {
                return true
            } else if (objA == null || objB == null) {
                return false
            }

            // Objects check for equality for primitive types
            if (typeof objA === 'number' || typeof objA === 'string' || typeof objA === 'boolean') {
                return objA === objB
            } else if (typeof objA === 'object') {
                // Objects are from "Date" type
                if (objA instanceof Date) {
                    return computeDateEquals(objA, objB)
                } else if (override && typeof objA.__equals__ === 'function') {
                    return objA.__equals__(objB)
                }

                return computeObjectEquals(objA, objB)
            }

            return false
        }

        /**
         * Performs a comparison of two objects of the same type and returns a value indicating whether one object is less than, equal to, or greater than the other.
         */
        const computeCompare = (objA: any, objB: any): number => {
            if (objA === objB) {
                // Identical objects
                return 0
            } else if (objA == null) {
                // null or undefined is less than everything
                return -1
            } else if (objB == null) {
                // Everything is greater than null or undefined
                return 1
            }
            if (
                typeof objA === 'number' || // numbers compare using "gt" operator
                typeof objA === 'boolean'
            ) {
                // booleans compare using "gt" operator
                return objA > objB ? 1 : -1 // values are already checked to equality
            } else if (typeof objA === 'string') {
                return objA.localeCompare(objB) // Strings are compared using String.prototype.localeCompare method
            }

            if (
                objA instanceof Date && // Dates are compared using 'getTime' method
                objB instanceof Date
            ) {
                const _t1 = objA.getTime(),
                    _t2 = objB.getTime()

                return _t1 > _t2 ? 1 : _t2 > _t1 ? -1 : 0
            }
            // Objects are compared using 'valueOf' method
            const _v1 = objA.valueOf(),
                _v2 = objB.valueOf()

            return _v1 > _v2 ? 1 : _v2 > _v1 ? -1 : 0
        }

        if (!isFunction(Date.prototype[props.proto.equals])) {
            // Define "eqTo" function for built-in types
            defineProperty(Date.prototype, props.proto.equals, {
                value(obj) {
                    return computeDateEquals(this, obj)
                },
            })
        }

        if (!isFunction(Date.prototype[props.proto.compare])) {
            // Define "cmpTo" function for built-in types
            defineProperty(Date.prototype, props.proto.compare, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Number.prototype[props.proto.equals])) {
            // Define "eqTo" function for built-in types
            defineProperty(Number.prototype, props.proto.equals, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(Number.prototype[props.proto.compare])) {
            // Define "cmpTo" function for built-in types
            defineProperty(Number.prototype, props.proto.compare, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(String.prototype[props.proto.equals])) {
            // Define "eqTo" function for built-in types
            defineProperty(String.prototype, props.proto.equals, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(String.prototype[props.proto.compare])) {
            // Define "cmpTo" function for built-in types
            defineProperty(String.prototype, props.proto.compare, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Boolean.prototype[props.proto.equals])) {
            // Define "eqTo" function for built-in types
            defineProperty(Boolean.prototype, props.proto.equals, {
                value(obj) {
                    return computePrimitiveEquals(this, obj)
                },
            })
        }

        if (!isFunction(Boolean.prototype[props.proto.compare])) {
            // Define "cmpTo" function for built-in types
            defineProperty(Boolean.prototype, props.proto.compare, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Object.prototype[props.proto.equals])) {
            // Define "eqTo" function for built-in types
            defineProperty(Object.prototype, props.proto.equals, {
                value(obj) {
                    return computeObjectEquals(this, obj)
                },
            })
        }

        if (!isFunction(Object.prototype[props.proto.compare])) {
            // Define "cmpTo" function for built-in types
            defineProperty(Object.prototype, props.proto.compare, {
                value(obj) {
                    return computeCompare(this, obj)
                },
            })
        }

        if (!isFunction(Date[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Date, props.static.equals, {
                value: (obj1, obj2) => computeDateEquals(obj1, obj2),
            })
        }

        if (!isFunction(Date[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(Date, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Number[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Number, props.static.equals, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(Number[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(Number, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(String[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(String, props.static.equals, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(String[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(String, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Boolean[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Boolean, props.static.equals, {
                value: (obj1, obj2) => computePrimitiveEquals(obj1, obj2),
            })
        }

        if (!isFunction(Boolean[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(Boolean, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Object[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Object, props.static.equals, {
                value: (obj1, obj2) => computeObjectEquals(obj1, obj2),
            })
        }

        if (!isFunction(Object[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(Object, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }

        if (!isFunction(Function[props.static.equals])) {
            // Define "__equals__" function for built-in types
            defineStaticProperty(Function, props.static.equals, {
                value: (obj1, obj2, override) => computeEquals(obj1, obj2, override),
            })
        }

        if (!isFunction(Function[props.static.compare])) {
            // Define "__compare__" function for built-in types
            defineStaticProperty(Function, props.static.compare, {
                value: (obj1, obj2) => computeCompare(obj1, obj2),
            })
        }
    })()

    export const getUserScript = (value: string): string => {
        return `${WINDOW_USER_SCRIPT_VARIABLE} = ${JSON.stringify(value)};`
    }

    const discardSingle = <A>(obj: A, toDiscard: string): A => {
        const result = {}
        const keys = Object.keys(obj)

        for (const key of keys) {
            if (key !== toDiscard && hasOwnProp.call(obj, key)) {
                result[key] = obj[key]
            }
        }

        return result as A
    }

    const discardMany = <A>(obj: A, toDiscard: string[]): A => {
        const result = {}
        const keys = Object.keys(obj)
        for (const key of keys) {
            if (-1 === toDiscard.indexOf(key) && hasOwnProp.call(obj, key)) {
                result[key] = obj[key]
            }
        }

        return result as A
    }

    export const getTagsByCode = (tags): unknown => {
        return tags.reduce((acc, tag) => {
            return { ...acc, [tag.code]: { ...tag, id: tag.code } }
        }, {})
    }

    export const toPrimitive = <T>(obj: T): any => {
        let funct, val, _i, _len
        let functions = ['valueOf', 'toString']

        if (typeof obj === 'object') {
            if (obj instanceof Date) {
                functions = ['toString', 'valueOf']
            }

            for (_i = 0, _len = functions.length; _i < _len; _i++) {
                funct = functions[_i]
                if (typeof obj[funct] === 'function') {
                    val = obj[funct]()
                    if (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean') {
                        return val
                    }
                }
            }

            throw new Error('Default value is ambiguous.')
        }
        return obj
    }

    export const getUniqueId = (() => {
        let id = 0
        return element => {
            if (!element.id) {
                element.id = `generated-uid-${id++}`
            }
            return element.id
        }
    })()

    export const directions = (...args): void => {
        const [start, ...remaining] = args
        const [finish, ...stops] = remaining.reverse()

        console.log(`drive through ${args.length} towns`)
        console.log(`start in ${start}`)
        console.log(`the destination is ${finish}`)
        console.log(`stopping ${stops.length} times in between`)
    }

    export const dispatcher = {
        join(before: any, after: any) {
            return `${before}:${after}`
        },
        sum(...rest: any[]) {
            return rest.reduce((prevValue: any, curValue: any): any => {
                return prevValue + curValue
            })
        },
    }

    export const hash = (...args: any[]): string => {
        return sha1(...args)
    }

    // console.log(mediator.relay('join', 'bar', 'baz'));
    export const mediator = {
        relay(method: string, ...args: any[]) {
            return dispatcher[method](...args)
        },
    }

    // const iterator = getCurrency();
    // console.log(iterator.next());
    export function* getCurrency(): Generator<string> {
        console.log('the generator function has started')
        const currencies = ['NGN', 'USD', 'EUR', 'GBP', 'CAD']
        for (const currency of currencies) {
            yield currency
        }
        console.log('the generator function has ended')
    }

    // caesarCipher('Hello World!', -3); // 'Ebiil Tloia!'
    // caesarCipher('Ebiil Tloia!', 23, true); // 'Hello World!'
    export const caesarCipher = (str: string, shift: number, decrypt = false): string => {
        const s = decrypt ? (26 - shift) % 26 : shift
        const n = s > 0 ? s : 26 + (s % 26)

        return [...str]
            .map((l, i) => {
                const c = str.charCodeAt(i)
                if (c >= 65 && c <= 90) return String.fromCharCode(((c - 65 + n) % 26) + 65)
                if (c >= 97 && c <= 122) return String.fromCharCode(((c - 97 + n) % 26) + 97)

                return l
            })
            .join('')
    }

    // const data = [[0, 0], [0, 1], [1, 3], [2, 0]];
    // const labels = [0, 1, 1, 0];
    // kNearestNeighbors(data, labels, [1, 2], 2); // 1
    // kNearestNeighbors(data, labels, [1, 0], 2); // 0
    export const kNearestNeighbors = (data: any, labels: number[], point: any, k = 3): any => {
        const kNearest = data
            .map((el, i) => ({
                dist: Math.hypot(...Object.keys(el).map(key => point[key] - el[key])),
                label: labels[i],
            }))
            .sort((a, b) => a.dist - b.dist)
            .slice(0, k)

        return kNearest.reduce(
            (acc, { label }, _) => {
                acc.classCounts[label] = Object.keys(acc.classCounts).includes(label)
                    ? acc.classCounts[label] + 1
                    : 1
                if (acc.classCounts[label] > acc.topClassCount) {
                    acc.topClassCount = acc.classCounts[label]
                    acc.topClass = label
                }
                return acc
            },
            {
                classCounts: {},
                topClass: kNearest[0].label,
                topClassCount: 0,
            },
        ).topClass
    }

    // luhnCheck('4485275742308327'); // true
    // luhnCheck(6011329933655299); //  false
    // luhnCheck(123456789); // false
    export const luhnCheck = (num: string | number): boolean => {
        const arr = `${num}`
            .split('')
            .reverse()
            .map(x => parseInt(x))
        const lastDigit = arr.splice(0, 1)[0]
        let sum = arr.reduce((acc, val, i) => (i % 2 !== 0 ? acc + val : acc + ((val * 2) % 9) || 9), 0)
        sum += lastDigit

        return sum % 10 === 0
    }

    // levenshteinDistance('duck', 'dark'); // 2
    export const levenshteinDistance = (s: string, t: string): number => {
        if (!s.length) return t.length
        if (!t.length) return s.length

        const calculateDist = (i: number, j: number, arr: number[]): number => {
            if (i === 0) {
                return j
            }

            return Math.min(
                arr[i - 1][j] + 1,
                arr[i][j - 1] + 1,
                arr[i - 1][j - 1] + (s[j - 1] === t[i - 1] ? 0 : 1),
            )
        }

        const arr: any[] = []
        for (let i = 0; i <= t.length; i++) {
            arr[i] = [i]
            for (let j = 1; j <= s.length; j++) {
                arr[i][j] = calculateDist(i, j, arr)
            }
        }

        return arr[t.length][s.length]
    }

    // vectorAngle([3, 4], [4, 3]); // 0.283794109208328
    export const vectorAngle = (x: number[], y: number[]): number => {
        const mX = Math.sqrt(x.reduce((acc, n) => acc + Math.pow(n, 2), 0))
        const mY = Math.sqrt(y.reduce((acc, n) => acc + Math.pow(n, 2), 0))

        return Math.acos(x.reduce((acc, n, i) => acc + n * y[i], 0) / (mX * mY))
    }

    // vectorDistance([10, 0, 5], [20, 0, 10]); // 11.180339887498949
    export const vectorDistance = (x: number[], y: number[]): number =>
        Math.sqrt(x.reduce((acc, val, i) => acc + Math.pow(val - y[i], 2), 0))

    // kMeans([[0, 0], [0, 1], [1, 3], [2, 0]], 2); // [0, 1, 1, 0]
    export const kMeans = (data: any, k = 1): any => {
        const centroids = data.slice(0, k)
        const distances = Array.from({ length: data.length }, () => Array.from({ length: k }, () => 0))
        const classes = Array.from({ length: data.length }, () => -1)
        let itr = true

        while (itr) {
            itr = false

            for (const d in data) {
                for (let c = 0; c < k; c++) {
                    distances[d][c] = Math.hypot(
                        ...Object.keys(data[0]).map(key => data[d][key] - centroids[c][key]),
                    )
                }
                const m = distances[d].indexOf(Math.min(...distances[d]))
                if (classes[d] !== m) itr = true
                classes[d] = m
            }

            for (let c = 0; c < k; c++) {
                centroids[c] = Array.from({ length: data[0].length }, () => 0)
                const size = data.reduce((acc, _, d) => {
                    if (classes[d] === c) {
                        acc++
                        for (const i in data[0]) centroids[c][i] += data[d][i]
                    }
                    return acc
                }, 0)
                for (const i in data[0]) {
                    centroids[c][i] = parseFloat(Number(centroids[c][i] / size).toFixed(2))
                }
            }
        }

        return classes
    }

    export const isEmpty = (value: any): boolean => {
        return (
            value === void 0 ||
            value === '' ||
            String(value).toLocaleLowerCase() === 'null' ||
            value === 'undefined' ||
            (typeof value === 'object' && Object.keys(value).length === 0)
        )
    }

    export function discard<A>(a: A, toDiscard: string | string[]): A {
        return typeof toDiscard === 'string' ? discardSingle(a, toDiscard) : discardMany(a, toDiscard)
    }

    /**
     * Determines whether the specified object instances are considered equal. calls the overridden "equals" method when available.
     * @param {Object} objA The first object to compare.
     * @param {Object} objB The second object to compare.
     * @returns {Boolean} true if the objA parameter is the same instance as the objB parameter, or if both are null, or if objA.equals(objB) returns true; otherwise, false.
     */
    export const equals = (objA: any, objB: any): boolean => {
        if (objA === objB) {
            return true // Objects are identical (including null)
        } else if (objA == null || objB == null) {
            return false
        }

        return sha1(objA) === sha1(objB) && Objects.shallowEquals(objA, objB)
    }
}
