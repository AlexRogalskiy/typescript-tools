import _ from 'lodash'

import { BiProcessor, Comparator, Consumer, Predicate, Processor } from '../../typings/function-types'

import { Checkers, CommonUtils, Errors, Maths, Numbers, Objects, Sorting } from '..'

import { SizeUtils } from '../utils/size-utils'

export namespace Arrays {
    import Helpers = Maths.Helpers

    import random = Numbers.random
    import randInt = Numbers.randInt

    import typeError = Errors.typeError
    import valueError = Errors.valueError

    import isNull = Checkers.isNull
    import isFunction = Checkers.isFunction
    import isArray = Checkers.isArray
    import checkType = Checkers.checkType
    import isInRange = Checkers.isInRange
    import checkArray = Checkers.checkArray

    import defineProperty = CommonUtils.defineProperty
    import lambda = CommonUtils.lambda
    import defineStaticProperty = CommonUtils.defineStaticProperty
    import isUndefined = Checkers.isUndefined
    import isNullOrUndefined = Checkers.isNullOrUndefined

    import fromBigInteger = SizeUtils.fromBigInteger
    import interpolateSizes = SizeUtils.interpolateSizes
    import toBigInteger = SizeUtils.toBigInteger

    import isNotNullOrUndefined = Checkers.isNotNullOrUndefined
    ;((): void => {
        const props = {
            proto: {
                index: 'index',
            },
            static: {
                index: '__index__',
            },
        }

        const indexOf_ = (array: any[], searchElement: any, fromIndex = 0): number => {
            let i,
                pivot = fromIndex ? fromIndex : 0

            if (!array) {
                throw new TypeError()
            }

            const length = array.length
            if (length === 0 || pivot >= length) {
                return -1
            }

            if (pivot < 0) {
                pivot = length - Math.abs(pivot)
            }

            for (i = pivot; i < length; i++) {
                if (array[i] === searchElement) {
                    return i
                }
            }

            return -1
        }

        if (!isFunction(Array.prototype[props.proto.index])) {
            defineProperty(Array.prototype, props.proto.index, {
                value(searchElement, fromIndex) {
                    return indexOf_(this as any[], searchElement, fromIndex)
                },
            })
        }

        if (!isFunction(Array[props.static.index])) {
            defineStaticProperty(Array, props.static.index, {
                value: (array, obj1, obj2) => indexOf_(array, obj1, obj2),
            })
        }
    })()

    export const arrayToMap = (array: string[]): { [key: string]: boolean } => {
        return array.reduce(
            (obj, value) => ({
                ...obj,
                [value]: true,
            }),
            {},
        )
    }

    // const x = [
    //     { id: 1, name: 'John' },
    //     { id: 2, name: 'Maria' }
    // ];
    // const y = [
    //     { id: 1, age: 28 },
    //     { id: 3, age: 26 },
    //     { age: 3}
    // ];
    // combine(x, y, 'id');
    export const combine = (a: any[], b: any[], prop: PropertyKey): any =>
        Object.values(
            [...a, ...b].reduce((acc, v) => {
                if (v[prop]) acc[v[prop]] = acc[v[prop]] ? { ...acc[v[prop]], ...v } : { ...v }
                return acc
            }, {}),
        )

    // countBy([6.1, 4.2, 6.3], Math.floor); // {4: 1, 6: 2}
    // countBy(['one', 'two', 'three'], 'length'); // {3: 2, 5: 1}
    // countBy([{ count: 5 }, { count: 10 }, { count: 5 }], x => x.count)
    // {5: 2, 10: 1}
    export const countBy2 = (arr: any, fn: any): any =>
        arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => {
            acc[val] = (acc[val] || 0) + 1
            return acc
        }, {})

    // deepFlatten([1, [2], [[3], 4], 5]); // [1, 2, 3, 4, 5]
    export const deepFlatten = (arr: any[]): any =>
        [].concat(...arr.map(v => (Array.isArray(v) ? deepFlatten(v) : v)))

    // [...dateRangeGenerator(new Date('2021-06-01'), new Date('2021-06-04'))];
    // [ 2021-06-01, 2021-06-02, 2021-06-03 ]
    export function* dateRangeGenerator(start: Date, end: Date, step = 1): any {
        const d = start
        while (d < end) {
            yield new Date(d)
            d.setDate(d.getDate() + step)
        }
    }

    // const binaryCycle = cycleGenerator([0, 1]);
    // binaryCycle.next(); // { value: 0, done: false }
    // binaryCycle.next(); // { value: 1, done: false }
    // binaryCycle.next(); // { value: 0, done: false }
    // binaryCycle.next(); // { value: 1, done: false }
    export function* cycleGenerator(arr: any[]): any {
        let i = 0
        while (true) {
            yield arr[i % arr.length]
            i++
        }
    }

    // differenceWith(
    //     [1, 1.2, 1.5, 3, 0],
    //     [1.9, 3, 0],
    //     (a, b) => Math.round(a) === Math.round(b)
    // ); // [1, 1.2]
    // differenceWith([1, 1.2, 1.3], [1, 1.3, 1.5]); // [1.2]
    export const differenceWith = (arr: any[], val: any[], comp = (a, b) => a === b): any[] =>
        arr.filter(a => val.findIndex(b => comp(a, b)) === -1)

    // differenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [1]
    // differenceBy([{ x: 2 }, { x: 1 }], [{ x: 1 }], v => v.x); // [2]
    export const differenceBy = (a: any, b: any, fn: any): any => {
        const s = new Set(b.map(fn))

        return a.map(fn).filter(el => !s.has(el))
    }

    // drop([1, 2, 3]); // [2, 3]
    // drop([1, 2, 3], 2); // [3]
    // drop([1, 2, 3], 42); // []
    export const drop = (arr: any[], n = 1): any[] => arr.slice(n)

    // dropRight([1, 2, 3]); // [1, 2]
    // dropRight([1, 2, 3], 2); // [1]
    // dropRight([1, 2, 3], 42); // []
    export const dropRight = (arr: any[], n = 1): any[] => arr.slice(0, -n)

    // dropWhile([1, 2, 3, 4], n => n >= 3); // [3, 4]
    export const dropWhile = (arr: any[], func: Predicate<any>): any => {
        while (arr.length > 0 && !func(arr[0])) arr = arr.slice(1)

        return arr
    }

    export const filterNonUnique = (arr: any[]): any[] =>
        [...new Set(arr)].filter(i => arr.indexOf(i) === arr.lastIndexOf(i))

    export const everyNth = (arr: any[], nth: number): any => arr.filter((_, i) => i % nth === nth - 1)

    // filterNonUniqueBy(
    //     [
    //         { id: 0, value: 'a' },
    //         { id: 1, value: 'b' },
    //         { id: 2, value: 'c' },
    //         { id: 1, value: 'd' },
    //         { id: 0, value: 'e' }
    //     ],
    //     (a, b) => a.id === b.id
    // ); // [ { id: 2, value: 'c' } ]
    export const filterNonUniqueBy = (arr: any[], fn: any): any[] =>
        arr.filter((v, i) => arr.every((x, j) => (i === j) === fn(v, x, i, j)))

    // filterUnique([1, 2, 2, 3, 4, 4, 5]); // [2, 4]
    export const filterUnique = (arr: any[]): any[] =>
        [...new Set(arr)].filter(i => arr.indexOf(i) !== arr.lastIndexOf(i))

    // filterUniqueBy(
    //     [
    //         { id: 0, value: 'a' },
    //         { id: 1, value: 'b' },
    //         { id: 2, value: 'c' },
    //         { id: 3, value: 'd' },
    //         { id: 0, value: 'e' }
    //     ],
    //     (a, b) => a.id == b.id
    // ); // [ { id: 0, value: 'a' }, { id: 0, value: 'e' } ]
    export const filterUniqueBy = (arr: any[], fn: any): any[] =>
        arr.filter((v, i) => arr.some((x, j) => (i !== j) === fn(v, x, i, j)))

    // findFirstN([1, 2, 4, 6], n => n % 2 === 0, 2); // [2, 4]
    // findFirstN([1, 2, 4, 6], n => n % 2 === 0, 5); // [2, 4, 6]
    export const findFirstN = (arr: any[], matcher: any, n = 1): any[] => {
        const res: any[] = []

        for (let i = 0; i < arr.length; i++) {
            const el = arr[i]
            const match = matcher(el, i, arr)
            if (match) res.push(el)
            if (res.length === n) return res
        }

        return res
    }

    // findLastN([1, 2, 4, 6], n => n % 2 === 0, 2); // [4, 6]
    // findLastN([1, 2, 4, 6], n => n % 2 === 0, 5); // [2, 4, 6]
    export const findLastN = (arr: any[], matcher: any, n = 1): any => {
        const res: any[] = []

        for (let i = arr.length - 1; i >= 0; i--) {
            const el = arr[i]
            const match = matcher(el, i, arr)
            if (match) res.unshift(el)
            if (res.length === n) return res
        }

        return res
    }

    // groupBy([6.1, 4.2, 6.3], Math.floor); // {4: [4.2], 6: [6.1, 6.3]}
    // groupBy(['one', 'two', 'three'], 'length'); // {3: ['one', 'two'], 5: ['three']}
    export const groupBy3 = (arr: any, fn: any): any =>
        arr.map(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val, i) => {
            acc[val] = (acc[val] || []).concat(arr[i])
            return acc
        }, {})

    // hasOne([1, 2], x => x % 2); // true
    // hasOne([1, 3], x => x % 2); // false
    export const hasOne = (arr: any[], fn: any): boolean => arr.filter(fn).length === 1

    // hasMany([1, 3], x => x % 2); // true
    // hasMany([1, 2], x => x % 2); // false
    export const hasMany = (arr: any[], fn: any): boolean => arr.filter(fn).length > 1

    export const head = (arr: any[]): any => (arr && arr.length ? arr[0] : undefined)

    export const includesAny = (arr: any[], values: any[]): boolean => values.some(v => arr.includes(v))

    export const includesAll = (arr: any[], values: any[]): boolean => values.every(v => arr.includes(v))

    // indexBy([
    //     { id: 10, name: 'apple' },
    //     { id: 20, name: 'orange' }
    // ], x => x.id);
    // { '10': { id: 10, name: 'apple' }, '20': { id: 20, name: 'orange' } }
    export const indexBy = (arr: any[], fn: any): any =>
        arr.reduce((obj, v, i) => {
            obj[fn(v, i, arr)] = v
            return obj
        }, {})

    // initializeNDArray(1, 3); // [1, 1, 1]
    // initializeNDArray(5, 2, 2, 2); // [[[5, 5], [5, 5]], [[5, 5], [5, 5]]]
    export const initializeNDArray = (val: any, ...args: any[]): boolean =>
        args.length === 0
            ? val
            : Array.from({ length: args[0] }).map(() => initializeNDArray(val, ...args.slice(1)))

    // join(['pen', 'pineapple', 'apple', 'pen'],',','&'); // 'pen,pineapple,apple&pen'
    // join(['pen', 'pineapple', 'apple', 'pen'], ','); // 'pen,pineapple,apple,pen'
    // join(['pen', 'pineapple', 'apple', 'pen']); // 'pen,pineapple,apple,pen'
    export const join = (arr: any[], separator = ',', end = separator): string =>
        arr.reduce((acc, val, i) => {
            if (i === arr.length - 2) {
                return acc + val + end
            }

            return i === arr.length - 1 ? acc + val : acc + val + separator
        }, '')

    // mergeSortedArrays([1, 4, 5], [2, 3, 6]); // [1, 2, 3, 4, 5, 6]
    export const mergeSortedArrays = (a: any[], b: any[]): any[] => {
        const _a = [...a],
            _b = [...b]

        return Array.from({ length: _a.length + _b.length }, () => {
            if (!_a.length) return _b.shift()
            else if (!_b.length) return _a.shift()
            else return _a[0] > _b[0] ? _b.shift() : _a.shift()
        })
    }

    // minBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], x => x.n); // 2
    // minBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 2
    export const minBy = (arr: number[], fn: any): number =>
        Math.min(...arr.map<number>(typeof fn === 'function' ? fn : val => val[fn]))

    // mergeSort([5, 1, 4, 2, 3]); // [1, 2, 3, 4, 5]
    export const mergeSort = (arr: number[]): (number | undefined)[] => {
        if (arr.length < 2) return arr
        const mid = Math.floor(arr.length / 2)
        const l = mergeSort(arr.slice(0, mid))
        const r = mergeSort(arr.slice(mid, arr.length))

        return Array.from({ length: l.length + r.length }, () => {
            if (!l.length) return r.shift()
            else if (!r.length) return l.shift()
            else return l[0] && r[0] && l[0] > r[0] ? r.shift() : l.shift()
        })
    }

    // median([5, 6, 50, 1, -5]); // 5
    export const median = (arr: number[]): number => {
        const mid = Math.floor(arr.length / 2),
            nums = [...arr].sort((a, b) => a - b)
        return arr.length % 2 !== 0 ? nums[mid] : (nums[mid - 1] + nums[mid]) / 2
    }

    // maxN([1, 2, 3]); // [3]
    // maxN([1, 2, 3], 2); // [3, 2]
    export const maxN = (arr: any[], n = 1): any => [...arr].sort((a, b) => b - a).slice(0, n)

    // maxBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], x => x.n); // 8
    // maxBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 8
    export const maxBy = (arr: number[], fn: any): number =>
        Math.max(...arr.map<number>(typeof fn === 'function' ? fn : val => val[fn]))

    // mapConsecutive([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 3, x => x.join('-'));
    // ['1-2-3', '2-3-4', '3-4-5', '4-5-6', '5-6-7', '6-7-8', '7-8-9', '8-9-10'];
    export const mapConsecutive = (arr: any[], n: number, fn: any): any[] =>
        arr.slice(n - 1).map((_, i) => fn(arr.slice(i, i + n)))

    // linearSearch([2, 9, 9], 9); // 1
    // linearSearch([2, 9, 9], 7); // -1
    export const linearSearch = (arr: any[], item: any): number => {
        for (let i = 0; i < arr.length; i++) {
            if (arr[i] === item) return +i
        }

        return -1
    }

    // const comments = [
    //     { id: 1, parent_id: null },
    //     { id: 2, parent_id: 1 },
    //     { id: 3, parent_id: 1 },
    //     { id: 4, parent_id: 2 },
    //     { id: 5, parent_id: 4 }
    // ];
    // const nestedComments = nest(comments);
    // [{ id: 1, parent_id: null, children: [...] }]
    export const nest = (items: any[], id = null, link = 'parent_id'): any[] =>
        items
            .filter(item => item[link] === id)
            .map(item => ({ ...item, children: nest(items, item.id, link) }))

    // nodeListToArray(document.childNodes); // [ <!DOCTYPE html>, html ]
    export const nodeListToArray = (nodeList: any): any[] => [...nodeList]

    // nthElement(['a', 'b', 'c'], 1); // 'b'
    // nthElement(['a', 'b', 'b'], -3); // 'a'
    export const nthElement = (arr: any[], n = 0): any => (n === -1 ? arr.slice(n) : arr.slice(n, n + 1))[0]

    // offset([1, 2, 3, 4, 5], 2); // [3, 4, 5, 1, 2]
    // offset([1, 2, 3, 4, 5], -2); // [4, 5, 1, 2, 3]
    export const offset = (arr: any[], offset: number): any[] => [
        ...arr.slice(offset),
        ...arr.slice(0, offset),
    ]

    // const users = [
    //     { name: 'fred', age: 48 },
    //     { name: 'barney', age: 36 },
    //     { name: 'fred', age: 40 },
    // ];
    // orderBy(users, ['name', 'age'], ['asc', 'desc']);
    // [{name: 'barney', age: 36}, {name: 'fred', age: 48}, {name: 'fred', age: 40}]
    //     orderBy(users, ['name', 'age']);
    // [{name: 'barney', age: 36}, {name: 'fred', age: 40}, {name: 'fred', age: 48}]
    export const orderBy = (arr: any[], props: string[], orders: string[]): any =>
        [...arr].sort((a, b) =>
            props.reduce((acc, prop, i) => {
                if (acc === 0) {
                    const [p1, p2] = orders && orders[i] === 'desc' ? [b[prop], a[prop]] : [a[prop], b[prop]]
                    acc = p1 > p2 ? 1 : p1 < p2 ? -1 : 0
                }
                return acc
            }, 0),
        )

    // const users = [
    //     { name: 'fred', language: 'Javascript' },
    //     { name: 'barney', language: 'TypeScript' },
    //     { name: 'frannie', language: 'Javascript' },
    //     { name: 'anna', language: 'Java' },
    //     { name: 'jimmy' },
    //     { name: 'nicky', language: 'Python' },
    // ];
    // orderWith(users, 'language', ['Javascript', 'TypeScript', 'Java']);
    /*
    [
      { name: 'fred', language: 'Javascript' },
      { name: 'frannie', language: 'Javascript' },
      { name: 'barney', language: 'TypeScript' },
      { name: 'anna', language: 'Java' },
      { name: 'jimmy' },
      { name: 'nicky', language: 'Python' }
    ]
    */
    export const orderWith = (arr: any[], prop: PropertyKey, order: string[]): any[] => {
        const orderValues = order.reduce((acc, v, i) => {
            acc[v] = i
            return acc
        }, {})

        return [...arr].sort((a, b) => {
            if (orderValues[a[prop]] === undefined) return 1
            if (orderValues[b[prop]] === undefined) return -1
            return orderValues[a[prop]] - orderValues[b[prop]]
        })
    }

    // let myArray = ['a', 'b', 'c', 'a', 'b', 'c'];
    // pull(myArray, 'a', 'c'); // myArray = [ 'b', 'b' ]
    export const pull = (arr: any[], ...args: any[]): any => {
        const argState = Array.isArray(args[0]) ? args[0] : args
        const pulled = arr.filter(v => !argState.includes(v))
        arr.length = 0

        for (const v of pulled) {
            arr.push(v)
        }
    }

    // reduceWhich([1, 3, 2]); // 1
    // reduceWhich([1, 3, 2], (a, b) => b - a); // 3
    // reduceWhich(
    //     [
    //         { name: 'Tom', age: 12 },
    //         { name: 'Jack', age: 18 },
    //         { name: 'Lucy', age: 9 }
    //     ],
    //     (a, b) => a.age - b.age
    // ); // {name: 'Lucy', age: 9}
    export const reduceWhich = (arr: any[], comparator = (a, b) => a - b): any[] =>
        arr.reduce((a, b) => (comparator(a, b) >= 0 ? b : a))

    // const data = [
    //     {
    //         id: 1,
    //         name: 'john',
    //         age: 24
    //     },
    //     {
    //         id: 2,
    //         name: 'mike',
    //         age: 50
    //     }
    // ];
    // reducedFilter(data, ['id', 'name'], item => item.age > 24);
    // [{ id: 2, name: 'mike'}]
    export const reducedFilter = (data: any[], keys: any[], fn: any): any =>
        data.filter(fn).map(el =>
            keys.reduce((acc, key) => {
                acc[key] = el[key]
                return acc
            }, {}),
        )

    // remove([1, 2, 3, 4], n => n % 2 === 0); // [2, 4]
    export const remove2 = (arr: any[], func: any): any[] => {
        if (Array.isArray(arr)) {
            return arr.filter(func).reduce((acc, val) => {
                arr.splice(arr.indexOf(val), 1)
                return acc.concat(val)
            }, [])
        }

        return []
    }

    // reject(x => x % 2 === 0, [1, 2, 3, 4, 5]); // [1, 3, 5]
    // reject(word => word.length > 4, ['Apple', 'Pear', 'Kiwi', 'Banana']);
    // ['Pear', 'Kiwi']
    export const reject = (pred: any, array: any[]): any[] => array.filter((...args) => !pred(...args))

    // reduceSuccessive([1, 2, 3, 4, 5, 6], (acc, val) => acc + val, 0);
    // [0, 1, 3, 6, 10, 15, 21]
    export const reduceSuccessive = <T>(arr: T[], fn: any, acc: T): T[] =>
        arr.reduce((res, val, i, arr) => (res.push(fn(res.slice(-1)[0], val, i, arr)), res), [acc])

    // randomIntArrayInRange(12, 35, 10); // [ 34, 14, 27, 17, 30, 27, 20, 26, 21, 14 ]
    export const randomIntArrayInRange = (min: number, max: number, n = 1): number[] =>
        Array.from({ length: n }, () => Math.floor(Math.random() * (max - min + 1)) + min)

    // var myArray = [{ x: 1 }, { x: 2 }, { x: 3 }, { x: 1 }];
    // pullBy(myArray, [{ x: 1 }, { x: 3 }], o => o.x); // myArray = [{ x: 2 }]
    export const pullBy = (arr: any[], ...args: any[]): void => {
        const length = args.length
        let fn = length > 1 ? args[length - 1] : undefined

        fn = typeof fn == 'function' ? (args.pop(), fn) : undefined

        const argState = (Array.isArray(args[0]) ? args[0] : args).map(val => fn(val))
        const pulled = arr.filter((v, _) => !argState.includes(fn(v)))
        arr.length = 0

        for (const v of pulled) {
            arr.push(v)
        }
    }

    // let myArray = ['a', 'b', 'c', 'd'];
    // let pulled = pullAtValue(myArray, ['b', 'd']);
    // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]
    export const pullAtValue = (arr: any[], pullArr: any[]): any[] => {
        const removed: any[] = []
        for (const v of arr) {
            pullArr.includes(v) ? removed.push(v) : v
        }
        const mutateTo = arr.filter((v, _) => !pullArr.includes(v))
        arr.length = 0

        for (const v of mutateTo) {
            arr.push(v)
        }

        return removed
    }

    export const sample = (arr: any[]): any => arr[Math.floor(Math.random() * arr.length)]

    // similarity([1, 2, 3], [1, 2, 4]); // [1, 2]
    export const similarity = (arr: any[], values: any[]): any[] => arr.filter(v => values.includes(v))

    // sortedLastIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x); // 1
    export const sortedLastIndexBy = (arr: any[], n: number, fn: any): number => {
        const isDescending = fn(arr[0]) > fn(arr[arr.length - 1])
        const val = fn(n)
        const index = arr
            .map<any>(fn)
            .reverse()
            .findIndex(el => (isDescending ? val <= el : val >= el))

        return index === -1 ? 0 : arr.length - index
    }

    // symmetricDifferenceBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [ 1.2, 3.4 ]
    // symmetricDifferenceBy(
    //     [{ id: 1 }, { id: 2 }, { id: 3 }],
    //     [{ id: 1 }, { id: 2 }, { id: 4 }],
    //     i => i.id
    // );
    // [{ id: 3 }, { id: 4 }]
    export const symmetricDifferenceBy = (a: any[], b: any[], fn: any): any[] => {
        const sA = new Set(a.map(v => fn(v))),
            sB = new Set(b.map(v => fn(v)))

        return [...a.filter(x => !sB.has(fn(x))), ...b.filter(x => !sA.has(fn(x)))]
    }

    export const tail = (arr: any[]): any[] => (arr.length > 1 ? arr.slice(1) : arr)

    export const take = (arr: any[], n = 1): any[] => arr.slice(0, n)

    // toHash([4, 3, 2, 1]); // { 0: 4, 1: 3, 2: 2, 3: 1 }
    // toHash([{ a: 'label' }], 'a'); // { label: { a: 'label' } }
    // A more in depth example:
    // let users = [
    //     { id: 1, first: 'Jon' },
    //     { id: 2, first: 'Joe' },
    //     { id: 3, first: 'Moe' },
    // ];
    // let managers = [{ manager: 1, employees: [2, 3] }];
    // We use function here because we want a bindable reference,
    // but a closure referencing the hash would work, too.
    // managers.forEach(
    //     manager =>
    //         (manager.employees = manager.employees.map(function(id) {
    //             return this[id];
    //         }, toHash(users, 'id')))
    // );
    // managers;
    // [ {manager:1, employees: [ {id: 2, first: 'Joe'}, {id: 3, first: 'Moe'} ] } ]
    export const toHash = (object: any, key: string): string =>
        Array.prototype.reduce.call(
            object,
            (acc, data, index) => ((acc[!key ? index : data[key]] = data), acc),
            {},
        )

    // unionBy([2.1], [1.2, 2.3], Math.floor); // [2.1, 1.2]
    // unionBy([{ id: 1 }, { id: 2 }], [{ id: 2 }, { id: 3 }], x => x.id)
    // [{ id: 1 }, { id: 2 }, { id: 3 }]
    export const unionBy = (a: any[], b: any[], fn: any): any[] => {
        const s = new Set(a.map(fn))

        return Array.from(new Set([...a, ...b.filter(x => !s.has(fn(x)))]))
    }

    // uniqueElementsBy(
    //     [
    //         { id: 0, value: 'a' },
    //         { id: 1, value: 'b' },
    //         { id: 2, value: 'c' },
    //         { id: 1, value: 'd' },
    //         { id: 0, value: 'e' }
    //     ],
    //     (a, b) => a.id == b.id
    // ); // [ { id: 0, value: 'a' }, { id: 1, value: 'b' }, { id: 2, value: 'c' } ]
    export const uniqueElementsBy = (arr: any[], fn: any): any[] =>
        arr.reduce((acc, v) => {
            if (!acc.some(x => fn(v, x))) acc.push(v)
            return acc
        }, [])

    // uniqueSymmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
    // uniqueSymmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 3]
    export const uniqueSymmetricDifference = (a: any[], b: any[]): any[] => [
        ...new Set([...a.filter(v => !b.includes(v)), ...b.filter(v => !a.includes(v))]),
    ]

    // unzip([['a', 1, true], ['b', 2, false]]); // [['a', 'b'], [1, 2], [true, false]]
    // unzip([['a', 1, true], ['b', 2]]); // [['a', 'b'], [1, 2], [true]]
    export const unzip = (arr: any[]): any[] =>
        arr.reduce(
            (acc, val) => {
                for (const [v, i] of val) {
                    acc[i].push(v)
                }
                return acc
            },
            Array.from({
                length: Math.max(...arr.map(x => x.length)),
            }).map(_ => []),
        )

    export const map = (arr: any[], callback: any): any[] => {
        const result: any = []

        for (let i = 0; i < arr.length; i++) {
            result.push(callback(arr[i], i))
        }

        return result
    }

    // zipWith([1, 2], [10, 20], [100, 200], (a, b, c) => a + b + c); // [111, 222]
    // zipWith(
    //     [1, 2, 3],
    //     [10, 20],
    //     [100, 200],
    //     (a, b, c) =>
    //         (a != null ? a : 'a') + (b != null ? b : 'b') + (c != null ? c : 'c')
    // ); // [111, 222, '3bc']
    export const zipWith = (...array: any[]): any[] => {
        const fn = typeof array[array.length - 1] === 'function' ? array.pop() : undefined

        return Array.from({ length: Math.max(...array.map(a => a.length)) }, (_, i) =>
            fn ? fn(...array.map(a => a[i])) : array.map(a => a[i]),
        )
    }

    // zip(['a', 'b'], [1, 2], [true, false]); // [['a', 1, true], ['b', 2, false]]
    // zip(['a'], [1, 2], [true, false]); // [['a', 1, true], [undefined, 2, false]]
    export const zip = (...arrays: any[]): any[] => {
        const maxLength = Math.max(...arrays.map(x => x.length))

        return Array.from({ length: maxLength }).map((_, i) => {
            return Array.from({ length: arrays.length }, (_, k) => arrays[k][i])
        })
    }

    // xProd([1, 2], ['a', 'b']); // [[1, 'a'], [1, 'b'], [2, 'a'], [2, 'b']]
    export const xProd = (a: any[], b: any[]): any[] =>
        a.reduce((acc, x) => acc.concat(b.map(y => [x, y])), [])

    // without([2, 1, 2, 3], 1, 2); // [3]
    export const without = (arr: any[], ...args: any[]): any[] => arr.filter(v => !args.includes(v))

    // weightedSample([3, 7, 9, 11], [0.1, 0.2, 0.6, 0.1]); // 9
    export const weightedSample = (arr: any[], weights: any[]): number => {
        const roll = Math.random()

        return arr[
            weights
                .reduce((acc, w, i) => (i === 0 ? [w] : [...acc, acc[acc.length - 1] + w]), [])
                .findIndex((v, i, s) => roll >= (i === 0 ? 0 : s[i - 1]) && roll < v)
        ]
    }

    // unzipWith(
    //     [
    //         [1, 10, 100],
    //         [2, 20, 200],
    //     ],
    //     (...args) => args.reduce((acc, v) => acc + v, 0)
    // );
    // [3, 30, 300]
    export const unzipWith = (arr: any[], fn: any): any[] =>
        arr
            .reduce(
                (acc, val) => {
                    for (const [v, i] of val) {
                        acc[i].push(v)
                    }
                    return acc
                },
                Array.from({
                    length: Math.max(...arr.map(x => x.length)),
                }).map(x => []),
            )
            .map(val => fn(...val))

    // uniqueElementsByRight(
    //     [
    //         { id: 0, value: 'a' },
    //         { id: 1, value: 'b' },
    //         { id: 2, value: 'c' },
    //         { id: 1, value: 'd' },
    //         { id: 0, value: 'e' }
    //     ],
    //     (a, b) => a.id == b.id
    // ); // [ { id: 0, value: 'e' }, { id: 1, value: 'd' }, { id: 2, value: 'c' } ]
    export const uniqueElementsByRight = (arr: any[], fn: any): any[] =>
        arr.reduceRight((acc, v) => {
            if (!acc.some(x => fn(v, x))) acc.push(v)
            return acc
        }, [])

    // uniqueElements([1, 2, 2, 3, 4, 4, 5]); // [1, 2, 3, 4, 5]
    export const uniqueElements = (arr: any[]): any[] => [...new Set(arr)]

    // unionWith(
    //     [1, 1.2, 1.5, 3, 0],
    //     [1.9, 3, 0, 3.9],
    //     (a, b) => Math.round(a) === Math.round(b)
    // );
    // [1, 1.2, 1.5, 3, 0, 3.9]
    export const unionWith = (a: any[], b: any[], comp: any): any[] =>
        Array.from(new Set([...a, ...b.filter(x => a.findIndex(y => comp(x, y)) === -1)]))

    // union([1, 2, 3], [4, 3, 2]); // [1, 2, 3, 4]
    export const union2 = (a: any[], b: any[]): any[] => Array.from(new Set([...a, ...b]))

    // var f = n => (n > 50 ? false : [-n, n + 10]);
    // unfold(f, 10); // [-10, -20, -30, -40, -50]
    export const unfold = (fn: any, seed: any): any => {
        const result: any[] = []
        let val = [null, seed]
        while ((val = fn(val[1]))) result.push(val[0])

        return result
    }

    // toPairs({ a: 1, b: 2 }); // [['a', 1], ['b', 2]]
    // toPairs([2, 4, 8]); // [[0, 2], [1, 4], [2, 8]]
    // toPairs('shy'); // [['0', 's'], ['1', 'h'], ['2', 'y']]
    // toPairs(new Set(['a', 'b', 'c', 'a'])); // [['a', 'a'], ['b', 'b'], ['c', 'c']]
    export const toPairs = (obj: any): any[] =>
        obj[Symbol.iterator] instanceof Function && obj.entries instanceof Function
            ? Array.from(obj.entries())
            : Object.entries(obj)

    // takeWhile([1, 2, 3, 4], n => n < 3); // [1, 2]
    export const takeWhile = (arr: any[], fn: any): any[] => {
        for (const [i, val] of arr.entries()) if (!fn(val)) return arr.slice(0, i)

        return arr
    }

    // takeUntil([1, 2, 3, 4], n => n >= 3); // [1, 2]
    export const takeUntil = (arr: any[], fn: any): any[] => {
        for (const [i, val] of arr.entries()) {
            if (fn(val)) return arr.slice(0, i)
        }

        return arr
    }

    // takeRightWhile([1, 2, 3, 4], n => n >= 3); // [3, 4]
    export const takeRightWhile = (arr: any[], fn: any): any[] => {
        for (const [i, val] of [...arr].reverse().entries()) if (!fn(val)) return i === 0 ? [] : arr.slice(-i)

        return arr
    }

    // takeRightUntil([1, 2, 3, 4], n => n < 3); // [3, 4]
    export const takeRightUntil = (arr: any[], fn: any): any[] => {
        for (const [i, val] of [...arr].reverse().entries()) if (fn(val)) return i === 0 ? [] : arr.slice(-i)

        return arr
    }

    // takeRight([1, 2, 3], 2); // [ 2, 3 ]
    // takeRight([1, 2, 3]); // [3]
    export const takeRight = (arr: any[], n = 1): any[] => arr.slice(arr.length - n, arr.length)

    // symmetricDifferenceWith(
    //     [1, 1.2, 1.5, 3, 0],
    //     [1.9, 3, 0, 3.9],
    //     (a, b) => Math.round(a) === Math.round(b)
    // ); // [1, 1.2, 3.9]
    export const symmetricDifferenceWith = (arr: any[], val: any[], comp: any): any => [
        ...arr.filter(a => val.findIndex(b => comp(a, b)) === -1),
        ...val.filter(a => arr.findIndex(b => comp(a, b)) === -1),
    ]

    // symmetricDifference([1, 2, 3], [1, 2, 4]); // [3, 4]
    // symmetricDifference([1, 2, 2], [1, 3, 1]); // [2, 2, 3]
    export const symmetricDifference = (a: any[], b: any[]): any[] => {
        const sA = new Set(a),
            sB = new Set(b)

        return [...a.filter(x => !sB.has(x)), ...b.filter(x => !sA.has(x))]
    }

    // superSet(new Set([1, 2, 3, 4]), new Set([1, 2])); // true
    // superSet(new Set([1, 2, 3, 4]), new Set([1, 5])); // false
    export const superSet = (a: any[], b: any[]): boolean => {
        const sA = new Set(a),
            sB = new Set(b)

        return [...sB].every(v => sA.has(v))
    }

    // sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], x => x.n); // 20
    // sumBy([{ n: 4 }, { n: 2 }, { n: 8 }, { n: 6 }], 'n'); // 20
    export const sumBy2 = (arr: number[], fn: any): number =>
        arr.map<number>(typeof fn === 'function' ? fn : val => val[fn]).reduce((acc, val) => acc + val, 0)

    // sum(1, 2, 3, 4); // 10
    // sum(...[1, 2, 3, 4]); // 10
    export const sum = (...arr: number[]): number => [...arr].reduce((acc, val) => acc + val, 0)

    // subSet(new Set([1, 2]), new Set([1, 2, 3, 4])); // true
    // subSet(new Set([1, 5]), new Set([1, 2, 3, 4])); // false
    export const subSet = (a: any[], b: any[]): boolean => {
        const sA = new Set(a),
            sB = new Set(b)

        return [...sA].every(v => sB.has(v))
    }

    // sortedLastIndex([10, 20, 30, 30, 40], 30); // 4
    export const sortedLastIndex = (arr: any[], n: number): number => {
        const isDescending = arr[0] > arr[arr.length - 1]
        const index = arr.reverse().findIndex(el => (isDescending ? n <= el : n >= el))

        return index === -1 ? 0 : arr.length - index
    }

    // sortedIndexBy([{ x: 4 }, { x: 5 }], { x: 4 }, o => o.x); // 0
    export const sortedIndexBy = (arr: any[], n: number, fn: any): number => {
        const isDescending = fn(arr[0]) > fn(arr[arr.length - 1])
        const val = fn(n)
        const index = arr.findIndex(el => (isDescending ? val >= fn(el) : val <= fn(el)))

        return index === -1 ? arr.length : index
    }

    // sortedIndex([5, 3, 2, 1], 4); // 1
    // sortedIndex([30, 50], 40); // 1
    export const sortedIndex = (arr: any[], n: number): number => {
        const isDescending = arr[0] > arr[arr.length - 1]
        const index = arr.findIndex(el => (isDescending ? n >= el : n <= el))

        return index === -1 ? arr.length : index
    }

    // sortCharactersInString('cabbage'); // 'aabbceg'
    export const sortCharactersInString = (str: string): string =>
        [...str].sort((a, b) => a.localeCompare(b)).join('')

    // const foo = [1, 2, 3];
    // shuffle(foo); // [2, 3, 1], foo = [1, 2, 3]
    export const shuffle4 = (...arr: any[]): any[] => {
        let m = arr.length
        while (m) {
            const i = Math.floor(Math.random() * m--)
            ;[arr[m], arr[i]] = [arr[i], arr[m]]
        }

        return arr
    }

    // const names = ['alpha', 'bravo', 'charlie'];
    // const namesAndDelta = shank(names, 1, 0, 'delta');
    // [ 'alpha', 'delta', 'bravo', 'charlie' ]
    // const namesNoBravo = shank(names, 1, 1); // [ 'alpha', 'charlie' ]
    // console.log(names); // ['alpha', 'bravo', 'charlie']
    export const shank = (arr: any[], index = 0, delCount = 0, ...elements: any[]): any[] =>
        arr
            .slice(0, index)
            .concat(elements)
            .concat(arr.slice(index + delCount))

    // sampleSize([1, 2, 3], 2); // [3, 1]
    // sampleSize([1, 2, 3], 4); // [2, 3, 1]
    export const sampleSize = ([...arr], n = 1): any[] => {
        let m = arr.length
        while (m) {
            const i = Math.floor(Math.random() * m--)
            ;[arr[m], arr[i]] = [arr[i], arr[m]]
        }

        return arr.slice(0, n)
    }

    // const repeater = repeatGenerator(5);
    // repeater.next(); // { value: 5, done: false }
    // repeater.next(); // { value: 5, done: false }
    // repeater.next(4); // { value: 4, done: false }
    // repeater.next(); // { value: 4, done: false }
    export function* repeatGenerator(val: any): any {
        let v = val
        while (true) {
            const newV = yield v
            if (newV !== undefined) v = newV
        }
    }

    // let myArray = ['a', 'b', 'c', 'd'];
    // let pulled = pullAtIndex(myArray, [1, 3]);
    // myArray = [ 'a', 'c' ] , pulled = [ 'b', 'd' ]
    export const pullAtIndex = (arr: any[], pullArr: any[]): any[] => {
        const removed: any[] = []
        const pulled = arr
            .map((v, i) => (pullArr.includes(i) ? removed.push(v) : v))
            .filter((_, i) => !pullArr.includes(i))
        arr.length = 0

        for (const v of pulled) {
            arr.push(v)
        }

        return removed
    }

    // prod(1, 2, 3, 4); // 24
    // prod(...[1, 2, 3, 4]); // 24
    export const prod = (...arr: number[]): number => [...arr].reduce((acc, val) => acc * val, 1)

    // powerset([1, 2]); // [[], [1], [2], [2, 1]]
    export const powerset = (arr: any[]): any[] =>
        arr.reduce((a, v) => a.concat(a.map(r => [v].concat(r))), [[]])

    // const simpsons = [
    //     { name: 'lisa', age: 8 },
    //     { name: 'homer', age: 36 },
    //     { name: 'marge', age: 34 },
    //     { name: 'bart', age: 10 }
    // ];
    // pluck2(simpsons, 'age'); // [8, 36, 34, 10]
    export const pluck2 = (arr: any[], key: PropertyKey): any => arr.map(i => i[key])

    // permutations([1, 33, 5]);
    // [ [1, 33, 5], [1, 5, 33], [33, 1, 5], [33, 5, 1], [5, 1, 33], [5, 33, 1] ]
    export const permutations = (arr: any[]): any[] => {
        if (arr.length <= 2) return arr.length === 2 ? [arr, [arr[1], arr[0]]] : arr

        return arr.reduce(
            (acc, item, i) =>
                acc.concat(
                    permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map(val => [item, ...val]),
                ),
            [],
        )
    }

    // percentile([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 6); // 55
    export const percentile = (arr: any[], val: any): number =>
        (100 * arr.reduce((acc, v) => acc + (v < val ? 1 : 0) + (v === val ? 0.5 : 0), 0)) / arr.length

    // objectToPairs({ a: 1, b: 2 }); // [ ['a', 1], ['b', 2] ]
    export const objectToPairs = (obj: any): any[] => Object.entries(obj)

    // objectToEntries({ a: 1, b: 2 }); // [ ['a', 1], ['b', 2] ]
    export const objectToEntries = (obj: any): any => Object.keys(obj).map(k => [k, obj[k]])

    // none([0, 1, 3, 0], x => x == 2); // true
    // none([0, 0, 0]); // true
    export const noneOf = (arr: any[], fn = Boolean): boolean => !arr.some(fn)

    // mostPerformant([
    //     () => {
    //         Loops through the entire array before returning `false`
    // [1, 2, 3, 4, 5, 6, 7, 8, 9, '10'].every(el => typeof el === 'number');
    // },
    // () => {
    //     Only needs to reach index `1` before returning `false`
    // [1, '2', 3, 4, 5, 6, 7, 8, 9, 10].every(el => typeof el === 'number');
    // }
    // ]); // 1
    export const mostPerformant = (fns: any[], iterations = 10000): number => {
        const times = fns.map(fn => {
            const before = performance.now()
            for (let i = 0; i < iterations; i++) fn()
            return performance.now() - before
        })

        return times.indexOf(Math.min(...times))
    }

    // mostFrequent(['a', 'b', 'a', 'c', 'a', 'a', 'b']); // 'a'
    export const mostFrequent = (arr: any[]): any =>
        Object.entries<any>(
            arr.reduce((a, v) => {
                a[v] = a[v] ? a[v] + 1 : 1
                return a
            }, {}),
        ).reduce<any>((a, v) => (v[1] >= a[1] ? v : a), [null, 0])[0]

    // minN([1, 2, 3]); // [1]
    // minN([1, 2, 3], 2); // [1, 2]
    export const minN = (arr: any[], n = 1): any[] => [...arr].sort((a, b) => a - b).slice(0, n)

    export const lastOf = (arr: any[]): any => (arr && arr.length ? arr[arr.length - 1] : undefined)

    // intersectionWith(
    //     [1, 1.2, 1.5, 3, 0],
    //     [1.9, 3, 0, 3.9],
    //     (a, b) => Math.round(a) === Math.round(b)
    // ); // [1.5, 3, 0]
    export const intersectionWith = (a: any[], b: any[], comp: any): any[] =>
        a.filter(x => b.findIndex(y => comp(x, y)) !== -1)

    // isContainedIn([1, 4], [2, 4, 1]); // true
    export const isContainedIn = (a: any[], b: any[]): boolean => {
        for (const v of new Set(a)) {
            if (!b.some(e => e === v) || a.filter(e => e === v).length > b.filter(e => e === v).length)
                return false
        }
        return true
    }

    // intersectionBy([2.1, 1.2], [2.3, 3.4], Math.floor); // [2.1]
    // intersectionBy(
    //     [{ title: 'Apple' }, { title: 'Orange' }],
    //     [{ title: 'Orange' }, { title: 'Melon' }],
    //     x => x.title
    // ); // [{ title: 'Orange' }]
    export const intersectionBy = (a: any[], b: any[], fn: any): any[] => {
        const s = new Set(b.map(fn))

        return [...new Set(a)].filter(x => s.has(fn(x)))
    }

    // intersection([1, 2, 3], [4, 3, 2]); // [2, 3]
    export const intersection = (a: any[], b: any[]): any[] => {
        const s = new Set(b)

        return [...new Set(a)].filter(x => s.has(x))
    }

    // let myArray = [1, 2, 3, 4];
    // insertAt(myArray, 2, 5); // myArray = [1, 2, 3, 5, 4]
    //
    // let otherArray = [2, 10];
    // insertAt(otherArray, 0, 4, 6, 8); // otherArray = [2, 4, 6, 8, 10]
    export const insertAt = (arr: any[], i: number, ...v: any[]): any[] => {
        arr.splice(i + 1, 0, ...v)
        return arr
    }

    // initializeArrayWithValues(5, 2); // [2, 2, 2, 2, 2]
    export const initializeArrayWithValues = (n: number, val = 0): number[] =>
        Array.from<number>({ length: n }).fill(val)

    // initializeArrayWithRangeRight(5); // [5, 4, 3, 2, 1, 0]
    // initializeArrayWithRangeRight(7, 3); // [7, 6, 5, 4, 3]
    // initializeArrayWithRangeRight(9, 0, 2); // [8, 6, 4, 2, 0]
    export const initializeArrayWithRangeRight = (end: number, start = 0, step = 1): number[] =>
        Array.from({ length: Math.ceil((end + 1 - start) / step) }).map(
            (_, i, arr) => (arr.length - i - 1) * step + start,
        )

    // initializeArrayWithRange(5); // [0, 1, 2, 3, 4, 5]
    // initializeArrayWithRange(7, 3); // [3, 4, 5, 6, 7]
    // initializeArrayWithRange(9, 0, 2); // [0, 2, 4, 6, 8]
    export const initializeArrayWithRange = (end: number, start = 0, step = 1): number[] =>
        Array.from({ length: Math.ceil((end - start + 1) / step) }, (_, i) => i * step + start)

    // initialize2DArray(2, 2, 0); // [[0, 0], [0, 0]]
    export const initialize2DArray = (w: number, h: number, val = null): any[][] =>
        Array.from({ length: h }).map(() => Array.from({ length: w }).fill(val))

    export const initial = (arr: any[]): any[] => arr.slice(0, -1)

    // indexOn([
    //     { id: 10, name: 'apple' },
    //     { id: 20, name: 'orange' }
    // ], x => x.id);
    // { '10': { name: 'apple' }, '20': { name: 'orange' } }
    export const indexOn = (arr: any[], key: any): any =>
        arr.reduce((obj, v) => {
            const { [key]: id, ...data } = v
            obj[id] = data
            return obj
        }, {})

    // indexOfAll([1, 2, 3, 1, 2, 3], 1); // [0, 3]
    // indexOfAll([1, 2, 3], 4); // []
    export const indexOfAll = (arr: any[], val: any): any =>
        arr.reduce((acc, el, i) => (el === val ? [...acc, i] : acc), [])

    // haveSameContents([1, 2, 4], [2, 4, 1]); // true
    export const haveSameContents = (a: any[], b: any[]): boolean => {
        for (const v of new Set([...a, ...b]))
            if (a.filter(e => e === v).length !== b.filter(e => e === v).length) return false
        return true
    }

    // node myScript.js -s --test --cool=true
    // hasFlags('-s'); // true
    // hasFlags('--test', 'cool=true', '-s'); // true
    // hasFlags('special'); // false
    export const hasFlags = (...flags: string[]): boolean =>
        flags.every(flag => process.argv.includes(/^-{1,2}/.test(flag) ? flag : `--${flag}`))

    // geometricProgression(256); // [1, 2, 4, 8, 16, 32, 64, 128, 256]
    // geometricProgression(256, 3); // [3, 6, 12, 24, 48, 96, 192]
    // geometricProgression(256, 1, 4); // [1, 4, 16, 64, 256]
    export const geometricProgression = (end: number, start = 1, step = 2): number[] =>
        Array.from({
            length: Math.floor(Math.log(end / start) / Math.log(step)) + 1,
        }).map((_, i) => start * step ** i)

    // const s = new Set([1, 2, 1, 3, 1, 4]);
    // generatorToArray(s.entries()); // [[ 1, 1 ], [ 2, 2 ], [ 3, 3 ], [ 4, 4 ]]
    export const generatorToArray = (gen: any): any[] => [...gen]

    // generateItems(10, Math.random);
    // [0.21, 0.08, 0.40, 0.96, 0.96, 0.24, 0.19, 0.96, 0.42, 0.70]
    export const generateItems = (n: number, fn: any): number[] => Array.from({ length: n }, (_, i) => fn(i))

    // frequencies(['a', 'b', 'a', 'c', 'a', 'a', 'b']); // { a: 4, b: 2, c: 1 }
    // frequencies([...'ball']); // { b: 1, a: 1, l: 2 }
    export const frequencies = (arr: any[]): any[] =>
        arr.reduce((a, v) => {
            a[v] = a[v] ? a[v] + 1 : 1
            return a
        }, {})

    // forEachRight([1, 2, 3, 4], val => console.log(val)); // '4', '3', '2', '1'
    export const forEachRight = (arr: any[], callback: any): void => {
        for (const item of arr.slice().reverse()) {
            callback(item)
        }
    }

    // flatten2([1, [2], 3, 4]); // [1, 2, 3, 4]
    // flatten2([1, [2, [3, [4, 5], 6], 7], 8], 2); // [1, 2, 3, [4, 5], 6, 7, 8]
    export const flatten2 = (arr: any[], depth = 1): any[] =>
        arr.reduce((a, v) => a.concat(depth > 1 && Array.isArray(v) ? flatten2(v, depth - 1) : v), [])

    // findLastKey(
    //     {
    //         barney: { age: 36, active: true },
    //         fred: { age: 40, active: false },
    //         pebbles: { age: 1, active: true }
    //     },
    //     x => x['active']
    // ); // 'pebbles'
    export const findLastKey = (obj: any, fn: any): any =>
        Object.keys(obj)
            .reverse()
            .find(key => fn(obj[key], key, obj))

    // findLastIndex([1, 2, 3, 4], n => n % 2 === 1); // 2 (index of the value 3)
    // findLastIndex([1, 2, 3, 4], n => n === 5); // -1 (default value when not found)
    export const findLastIndex = (arr: any[], fn: any): any =>
        (arr
            .map((val, i) => [i, val])
            .filter(([i, val]) => fn(val, i, arr))
            .pop() || [-1])[0]

    // findLast([1, 2, 3, 4], n => n % 2 === 1); // 3
    export const findLast = (arr: any[], fn: any): any => arr.filter(fn).pop()

    // dropRightWhile([1, 2, 3, 4], n => n < 3); // [1, 2]
    export const dropRightWhile = (arr: any[], func: Predicate<any>): any => {
        let rightIndex = arr.length
        while (rightIndex-- && !func(arr[rightIndex]));

        return arr.slice(0, rightIndex + 1)
    }

    // difference([1, 2, 3, 3], [1, 2, 4]); // [3, 3]
    export const difference = (a: any, b: any): any => {
        const s = new Set(b)

        return a.filter(x => !s.has(x))
    }

    export const countOccurrences = (arr: any[], val: any): number =>
        arr.reduce((a, v) => (v === val ? a + 1 : a), 0)

    export const compact = (arr: any[]): any[] => arr.filter(Boolean)

    export const castArray = (val: any): any => (Array.isArray(val) ? val : [val])

    // chunk([1, 2, 3, 4, 5], 2); // [[1, 2], [3, 4], [5]]
    export const chunk = (arr: any[], size: number): any[] =>
        Array.from({ length: Math.ceil(arr.length / size) }, (_, i) => arr.slice(i * size, i * size + size))

    // cartesianProduct(['x', 'y'], [1, 2]);
    export const cartesianProduct = (a: any[], b: any[]): any[] =>
        a.reduce((p, x) => [...p, ...b.map(y => [x, y])], [])

    // bifurcateBy(['beep', 'boop', 'foo', 'bar'], x => x[0] === 'b');
    // [ ['beep', 'boop', 'bar'], ['foo'] ]
    export const bifurcateBy = (arr: any[], fn: any): any[][] =>
        arr.reduce((acc, val, i) => (acc[fn(val, i) ? 0 : 1].push(val), acc), [[], []])

    // bifurcate(['beep', 'boop', 'foo', 'bar'], [true, true, false, true]);
    // [ ['beep', 'boop', 'bar'], ['foo'] ]
    export const bifurcate = (arr: any[], filter: boolean[]): any[][] =>
        arr.reduce((acc, val, i) => (acc[filter[i] ? 0 : 1].push(val), acc), [[], []])

    // arrayToHTMLList(['item 1', 'item 2'], 'myListID');
    export const arrayToHTMLList = (arr: any[], listID: string): string => {
        const items = document.querySelector(`#${listID}`)
        if (!items) {
            return ''
        }

        return (items.innerHTML += arr.map(item => `<li>${item}</li>`).join(''))
    }

    export const arrayToCSV = (arr: any[], delimiter = ','): string =>
        arr.map(v => v.map(x => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)).join('\n')

    // aperture(2, [1, 2, 3, 4]); // [[1, 2], [2, 3], [3, 4]]
    // aperture(3, [1, 2, 3, 4]); // [[1, 2, 3], [2, 3, 4]]
    // aperture(5, [1, 2, 3, 4]); // []
    export const aperture = (n: number, arr: any[]): any[] =>
        n > arr.length ? [] : arr.slice(n - 1).map((_, i) => arr.slice(i, i + n))

    // allUniqueBy([1.2, 2.4, 2.9], Math.round);
    // allUniqueBy([1.2, 2.3, 2.4], Math.round);
    export const allUniqueBy = (arr: any[], fn: (value: any, index: number, array: any[]) => any): boolean =>
        arr.length === new Set(arr.map(fn)).size

    export const allUnique = (arr: any[]): boolean => arr.length === new Set(arr).size

    // allEqualBy([1.1, 1.2, 1.3], Math.round);
    // allEqualBy([1.1, 1.3, 1.6], Math.round);
    export const allEqualBy = (arr: any[], fn: any): boolean => {
        const eql = fn(arr[0])

        return arr.every(val => fn(val) === eql)
    }

    export const allEqual = (arr: any[]): boolean => arr.every(val => val === arr[0])

    export const isArraysEqual = <T>(first: T[], second: T[]): boolean => {
        if (first.length !== second.length) {
            return false
        }

        return !first.some(region => !second.includes(region))
    }

    export const flat = <T extends any[]>(array: T): FlatArray<T, 1>[] => {
        if (array.flat) {
            return array.flat()
        }

        // EDGE workaround
        return array.reduce((acc, val) => acc.concat(val), [])
    }

    export const addUnique = (arr: any[], items: any[]): any[] => {
        for (const item of items) {
            if (!arr.includes(item)) {
                arr.push(item)
            }
        }

        return arr
    }

    export const splice = (str: string, index: number, deleteCount: number, element: string): string =>
        str.slice(0, index) + element + str.slice(index + deleteCount)

    export const remove = (index: number, arr: any[]): any => arr.splice(index, 1)[0]

    export const uniqueArray = <T>(arr: T[]): T[] => Array.from(new Set(arr))

    export const asyncForEach = async (array, callback): Promise<void> => {
        for (let index = 0; index < array.length; index++) {
            await callback(array[index], index, array)
        }
    }

    export const findMinimalFree = (
        array: number[],
        base: number,
        comparator: Comparator<number> = (a, b) => b - a,
    ): number => {
        return array.sort(comparator).reduceRight((prev, cur) => (prev === cur ? prev + 1 : prev), base)
    }

    export const appendToArray = (sliceSize: number) => (destination, source) => {
        // NOTE: destination.push(...source) throws "RangeError: Maximum call stack
        // size exceeded" for sufficiently lengthy source arrays
        let index = 0
        let slice = []
        while ((slice = source.slice(index, index + sliceSize)).length > 0) {
            destination.push(...slice)
            index += sliceSize
        }
    }

    export const arrayEquals = <T>(a: T[], b: T[]): boolean =>
        a.length === b.length && a.every((_, i) => a[i] === b[i])

    export const makeArray3 = <T>(size: number, initializer: any): T[] => {
        if (!isFunction(initializer)) {
            const val = initializer
            initializer = () => val
        }

        const array: T[] = []
        for (let i = 0; i < size; ++i) {
            array.push(initializer(i))
        }
        return array
    }

    export const first = <T>(arr: T[]): T => {
        return arr[0]
    }

    export const last = <T>(arr): T[] => {
        return arr[arr.length - 1]
    }

    export const clamp = (num, min, max): number => {
        return Math.max(min, Math.min(num, max))
    }

    export const flatMap = <T>(arr: any, selector: BiProcessor<any, number, T>): T[] => {
        return arr.reduce((result, item, i) => {
            const mappedValue = selector(item, i)
            if (isNotNullOrUndefined(mappedValue)) {
                if (Array.isArray(mappedValue)) {
                    result.push(...mappedValue)
                } else {
                    result.push(mappedValue)
                }
            }

            return result
        }, [])
    }

    export const memoize = (func: any, areArgsEqual = equalItems): any => {
        let lastArgs: any[] = [],
            lastResult

        return function (...args) {
            if (!areArgsEqual(args, lastArgs)) {
                lastResult = Objects.deepFreeze(func(...(lastArgs = args)))
            }
            return lastResult
        }
    }

    export const sumBy = <T>(array: T[], selector: Processor<T, number>): number => {
        return array.map(selector).reduce((sum, value) => sum + value, 0)
    }

    export const averageBy = <T>(array: T[], selector: Processor<T, number>): number => {
        return sumBy(array, selector) / array.length
    }

    export const keyBy = (arrayOrIter, keySelector, valueMapper: any): any => {
        const array = Array.isArray(arrayOrIter) ? arrayOrIter : Array.from(arrayOrIter)

        return array.reduce((map, item, i) => {
            const key = keySelector(item, i)
            map[key] = valueMapper(item, key, map[key])
            return map
        }, {})
    }

    export const bitsToNumber = (...bits: number[]): number => {
        // @ts-ignore
        return bits.reduce((number, bit) => (number << 1) | (!!bit | 0), 0)
    }

    export const makeRange = (start: number, end: number): any => {
        if (isUndefined(end)) {
            if (start < 0) {
                throw new TypeError('Invalid count')
            }

            end = start - 1
            start = 0
        }

        const dir = start > end ? -1 : 1
        const count = Math.abs(end - start + dir)

        return makeArray3(count, i => i * dir + start)
    }

    export const aggregateStorage = (...list): any => {
        const aggregate = list.reduce((aggregate, storage) => {
            for (const [key, value] of Object.entries(storage)) {
                aggregate[key] = aggregate[key].add(toBigInteger(value))
            }
            return aggregate
        }, {})

        return mapValues(aggregate, fromBigInteger)
    }

    export const interpolateStorage = (storage1, storage2, t): any => {
        const keySet = new Set([...Object.keys(storage1), ...Object.keys(storage2)])

        return keyBy(
            keySet.keys(),
            i => i,
            key => interpolateSizes(storage1[key], storage2[key], t),
        )
    }

    export const keyByProperty2 = (array, keyName, valueMapper): any => {
        return keyBy(array, item => item[keyName], valueMapper)
    }

    export const groupBy2 = (array, keySelector, valueMapper: any): any => {
        return keyBy(array, keySelector, (item, _, list: any[] = []) => {
            list.push(valueMapper(item))
            return list
        })
    }

    export const countBy = <T>(array: T[], keySelector: any): any => {
        return keyBy(array, keySelector, (_, __, count = 0) => count + 1)
    }

    export const mapValues = (obj: any, mapOp: (value, key) => any, omitUndefinedValues = true): any => {
        const res = {}

        for (const [key, value] of Object.entries(obj)) {
            const newValue = mapOp(value, key)
            if (!omitUndefinedValues || isNullOrUndefined(newValue)) res[key] = newValue
        }

        return res
    }

    export const mergeBy = (...arrays): any => {
        const keySelector = isFunction(last(arrays)) ? arrays.pop() : null
        const merge = {}

        for (const arr of arrays) {
            Object.assign(
                merge,
                keyBy(arr, keySelector, i => i),
            )
        }

        return Object.values(merge)
    }

    export const reverse = (iterable): any => {
        return Array.from(iterable).reverse()
    }

    export const get = (val, path, defaultValue): any => {
        for (const part of path) {
            if (val == null) {
                val = undefined
                break
            }

            val = val[part]
        }

        return isNullOrUndefined(val) ? val : defaultValue
    }

    export const equalItems = (arr1, arr2): boolean => {
        if (arr1.length !== arr2.length) {
            return false
        }

        for (let i = 0; i < arr1.length; ++i) {
            if (!Object.is(arr1[i], arr2[i])) {
                return false
            }
        }

        return true
    }

    export const unique = (values: any[]): any[] => {
        return Array.from(new Set(values).values())
    }

    export const unionAll = (...arrays: any[]): any[] => {
        return unique(flatMap(arrays, i => i))
    }

    export const hashCode = (value: any): number => {
        return Array.from(JSON.stringify(value)).reduce(
            (hash, char) => ((hash << 5) - hash + char.charCodeAt(0)) | 0,
            0,
        )
    }

    export const filterValues = (obj: any, filter: (value, key) => any): any => {
        return mapValues(obj, (value, key) => (filter(value, key) ? value : undefined))
    }

    /**
     * Ensures the given value is a string array.
     *
     * @param {any} x - The value to ensure.
     * @returns {string[]} The string array.
     */
    export const toStringArray = (x: any[]): string[] => {
        if (Array.isArray(x)) {
            return x.map(String)
        }
        return []
    }

    export const randomJoin = (n: number, delim = ' ', ...args: any[]): string => {
        return _.range(n)
            .map(() => randomElement(args))
            .join(delim)
    }

    export const validateString = (input: string, lexDelim = ',', tokenDelim = '='): boolean => {
        if (!input) {
            return true
        }

        const pairs = input.split(lexDelim)
        const res = pairs.map(pair => {
            const s = pair.split(tokenDelim)
            const [key, val] = s
            return key && val
        })

        if (res.some(r => !r)) {
            throw valueError("Values should be specified in 'key=val,key2=val2' format!")
        }

        return true
    }

    export const findMinValue = (arr: number[]): number => {
        return Math.min.apply(
            null,
            arr.filter(i => i !== undefined),
        )
    }

    export const findMaxValue = (arr: number[]): number => {
        return Math.max.apply(
            null,
            arr.filter(i => i !== undefined),
        )
    }

    export const selectors = (keys: string[], selectors: string[]): { [k: string]: any } => {
        return Object.keys(selectors)
            .map(selector => {
                if (keys.includes(selector)) {
                    return [selector, selectors[selector]]
                }

                return null
            })
            .filter(x => x)
    }

    export const trimNulls = <T>(arr: T[]): { deleted: number; result: T[] } => {
        const len = arr.length

        let i = 0
        while ((arr[i] === null || typeof arr[i] === 'undefined') && i < len) {
            ++i
        }

        return {
            deleted: i,
            result: arr.slice(i),
        }
    }

    export const init = (() => {
        const props = {
            proto: {
                unique: 'unique',
                forEachParallel: 'forEachParallel',
                forEachSequential: 'forEachSequential',
            },
        }

        const unique_ = (obj: any): any => {
            const res = obj.concat()
            for (let i = 0; i < res.length; ++i) {
                for (let j = i + 1; j < res.length; ++j) {
                    if (res[i] === res[j]) {
                        res.splice(j--, 1)
                    }
                }
            }

            return res
        }

        const iterateAsync_ = async <T>(obj: any, func: (item: T) => Promise<void>): Promise<void> => {
            await Promise.all(obj.map(async (item: T) => await func(item)))
        }

        const iterateSync_ = async <T>(obj: any, func: (item: T) => void): Promise<void> => {
            for (const item of obj) {
                func(item)
            }
        }

        if (!isFunction(Array.prototype[props.proto.unique])) {
            defineProperty(Array.prototype, props.proto.unique, {
                value(): any[] {
                    return unique_(this)
                },
            })
        }

        if (!isFunction(Array.prototype[props.proto.forEachParallel])) {
            defineProperty(Array.prototype, props.proto.forEachParallel, {
                async value(func: (item: any) => Promise<void>): Promise<void> {
                    return await iterateAsync_(this, func)
                },
            })
        }

        if (!isFunction(Array.prototype[props.proto.forEachSequential])) {
            defineProperty(Array.prototype, props.proto.forEachSequential, {
                async value(func: (item: any) => Promise<void>): Promise<void> {
                    return await iterateSync_(this, func)
                },
            })
        }
    })()

    /**
     * Copies array and then pushes item into it.
     * @param {array} arr Array to copy and into which to push
     * @param {any} item Array item to add (to end)
     * @returns {array} Copy of the original array
     */
    export const push = (arr: any[], item: any): any[] => {
        arr = arr.slice()
        arr.push(item)
        return arr
    }

    /**
     * Copies array and then unshifts item into it.
     * @param {any} item Array item to add (to beginning)
     * @param {array} arr Array to copy and into which to unshift
     * @returns {array} Copy of the original array
     */
    export const unshift = (item: any, arr: any): any[] => {
        arr = arr.slice()
        arr.unshift(item)
        return arr
    }

    /**
     * Copy items out of one array into another.
     * @param {array} source Array with items to copy
     * @param {array} target Array to which to copy
     * @param {function} conditionCb Callback passed the current item;
     *     will move item if evaluates to `true`
     * @returns {void}
     */
    export const moveToAnotherArray = (source: any[], target: any[], conditionCb): void => {
        const il = source.length
        for (let i = 0; i < il; i++) {
            const item = source[i]
            if (conditionCb(item)) {
                target.push(source.splice(i--, 1)[0])
            }
        }
    }

    export const list = (...args: any[]): any[] => {
        // const unboundSlice = Array.prototype.slice
        // const slice = Function.prototype.call.bind(unboundSlice)
        // return slice(args, 0)
        return Array.prototype.slice.call(args, 0)
    }

    /**
     * Creates array by range
     * range(n) creates a array from 1 to n, including n
     * range(n,m) creates a array from n to m, by step of 1. May not include m, if n or m are not integer.
     * range(n,m,delta) creates a array from n to m, by step of delta. May not include m
     *
     * @param min
     * @param max
     * @param delta
     */
    export const rangeBy = (min: number, max?: number, delta?: number): number[] => {
        const res: number[] = []
        let myStepCount

        if (!max) {
            for (let i = 0; i < min; i++) {
                res[i] = i + 1
            }
        } else {
            if (!delta) {
                myStepCount = max - min
                for (let i = 0; i <= myStepCount; i++) {
                    res.push(i + min)
                }
            } else {
                myStepCount = Math.floor((max - min) / delta)
                for (let i = 0; i <= myStepCount; i++) {
                    res.push(i * delta + min)
                }
            }
        }

        return res
    }

    export const insertAll = (array: any[], index: number, ...args: any): any[] => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        index = Math.min(index, array.length)
        array.splice(index, 0, ...args)
        return array
    }

    export function shuffle<T>(arr: T[]): T[] {
        if (!Array.isArray(arr)) {
            throw new Error('expected an array')
        }
        const len = arr.length
        const result = Array(len)
        for (let i = 0, rand; i < len; i++) {
            rand = Math.floor(Math.random() * i)
            if (rand !== i) {
                result[i] = result[rand]
            }
            result[rand] = arr[i]
        }

        return result
    }

    export const range = (start: number, end: number, step: number): number[] => {
        const array: number[] = []

        if (step > 0) {
            for (let i = start; i <= end; i += step) {
                array.push(i)
            }
        } else {
            for (let i = start; i >= end; i += step) {
                array.push(i)
            }
        }

        return array
    }

    export const randomElement = <T>(arr: T[]): T => arr[random(arr.length)]

    /**
     * Utility function to create a K:V from a list of strings
     * @param o initial input array to operate by
     * @param func
     */
    export const strToEnum = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
        return o.reduce((res, key) => {
            res[key] = func(key)
            return res
        }, Object.create(null))
    }

    /**
     * Utility function to create a K:V from a list of strings
     * @param o initial input array to operate by
     * @param func
     */
    export const strToEnumFunc = <T extends string, V>(o: T[], func: (v: T) => V): { [K in T]: V } => {
        return o.reduce((res, key) => {
            res[key] = func(key)
            return res
        }, Object.create(null))
    }

    export const sortByNumber = <T>(items: T[], property: string, direction = 'asc'): T[] => {
        return items.slice(0).sort((a, b) => {
            const diff = a[property] - b[property]
            return diff * (direction === 'desc' ? -1 : 1)
        })
    }

    export const filterBy = (property: PropertyKey): Consumer<any> => {
        const set = new Set()
        return obj => !(set.has(obj[property]) || !set.add(obj[property]))
    }

    export const sortByString = <T>(items: T[], property: string, direction = 'asc'): T[] => {
        return items
            .slice(0) // use `slice(0)` to avoid mutating the array
            .sort((a, b) => {
                const diff = a[property].localeCompare(b[property])
                return diff * (direction === 'desc' ? -1 : 1)
            })
    }

    /*
    Sort an array of projects, applying the given function to all projects.
    If the function returns `undefined` (meaning that no data is available),
    the project should be displayed at the end, when the descending direction is used (by default).
    */
    export const sortProjectsByFunction = <T>(
        projects: T[],
        func: Processor<T, number>,
        property: string,
        direction = 'desc',
    ): T[] => {
        const getValue = (project: T): number => {
            const value = func(project)
            return value === undefined ? -Infinity : value
        }

        return projects.slice(0).sort((a, b) => {
            let diff = getValue(a) - getValue(b)
            if (diff === 0) {
                diff = a[property] - b[property]
            }

            return diff * (direction === 'desc' ? -1 : 1)
        })
    }

    export const groupBy = <T, K extends PropertyKey>(list: T[], getKey: (item: T) => K): Record<K, T[]> => {
        return list.reduce((previous, currentItem) => {
            const group = getKey(currentItem)
            if (!previous[group]) {
                previous[group] = []
            }
            previous[group].push(currentItem)

            return previous
        }, {} as Record<K, T[]>)
    }

    export const average = (array: number[]): number => array.reduce((p, c) => p + c, 0) / array.length

    export const makeArray = <T>(value: T): T[] => (Array.isArray(value) ? value : [value])

    export const makeArray2 = <T>(array: any): T[] => {
        // Array.from(arrayLike);
        return Array.prototype.slice.call(array)
    }

    export const eliminateDuplicates = <T>(items: T[]): T[] => {
        return [...new Set(items)]
    }

    export const randWeightedArray = (numbers: number[]): number[] => {
        if (!isArray(numbers)) {
            throw typeError(`incorrect input argument: {numbers} is not array < ${numbers} >`)
        }

        let total = 0
        const dist = Helpers.getEmptyNumberVector()

        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const index in numbers) {
            if (numbers.hasOwnProperty(index)) {
                total += numbers[index]
                dist[index] = total
            }
        }

        const result: number[] = []
        const rand = randInt(0, total)

        for (const index of dist) {
            if (Object.prototype.hasOwnProperty.call(dist, index)) {
                if (rand < dist[index]) {
                    result.push(Number(index))
                }
            }
        }

        return result
    }

    export const copyOfArray = (array: any[]): any[] => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array < ${array} >`)
        }

        const res: any[] = []
        for (const item of array) {
            isArray(item) ? res.push(item.slice(0)) : res.push(item)
        }

        return res
    }

    export const createAndFillArray = (start: number, end: number, func): any[] => {
        if (isNull(start) || isNull(end) || !isFunction(func)) {
            throw valueError(
                `incorrect input values: start < ${start} >, end < ${end} >, function of elements < ${func} >`,
            )
        }

        const res: any[] = []
        for (let i = start; i < end; i = func(i)) {
            res.push(i)
        }

        return res
    }

    export const pluck = <T>(prop: PropertyKey, ...values: T[]): T[] => {
        const res: T[] = []

        for (let i = 0, member; (member = values[i]); i++) {
            res.push(member[prop] || member)
        }

        return res
    }

    export const unsortedRemoveDuplicates = <T>(comparator: Comparator<T>, ...values: T[]): T[] => {
        const copy = [...values]
        if (comparator) {
            for (let i = 0; i < copy.length; i++) {
                const src = copy[i]
                for (let j = i + 1; j < copy.length; j++) {
                    if (comparator(copy[j], src) === 0) {
                        copy.splice(j, 1)
                    }
                }
            }
        } else {
            for (let i = 0; i < copy.length; i++) {
                const src = copy[i]
                for (let j = i + 1; j < copy.length; j++) {
                    if (copy[j] === src) {
                        copy.splice(j--, 1)
                    }
                }
            }
        }

        return copy
    }

    export const unsortedIntersect = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        if (!array1 || !array2) {
            return unsortedRemoveDuplicates(comparator)
        }

        const len2 = array2.length
        array1 = unsortedRemoveDuplicates(comparator, ...array1)

        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0; j < len2; j++) {
                    if (comparator(array2[j], src) === 0) break
                }
                if (i === len2) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0; j < len2; j++) {
                    if (array2[j] === src) break
                }
                if (i === len2) {
                    array2.splice(i--, 1)
                }
            }
        }

        return array2
    }

    export const unsortedExclusion = <T>(comparator: Comparator<T>, ...array: T[]): T[] => {
        const copy: T[] = unsortedRemoveDuplicates(comparator, ...array)

        if (!array) {
            return copy
        }

        const left = unsortedSubtract(comparator, copy, array)
        const right = unsortedSubtract(comparator, array, copy)

        return left.concat(right).sort(comparator)
    }

    export const unsortedSubtract = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(comparator, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(comparator, ...array2)
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0, len = array2.length; j < len; j++) {
                    if (comparator(array2[j], src) === 0) {
                        array1.splice(i--, 1)
                        break
                    }
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = 0, len = array2.length; j < len; j++) {
                    if (array2[j] === src) {
                        array1.splice(i--, 1)
                        break
                    }
                }
            }
        }

        return array1
    }

    export const unsortedUnion = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        return unsortedRemoveDuplicates(comparator, ...[...array1, ...array2])
    }

    export const exclusion = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = removeDuplicates(comparator, array1, array2)
        if (!array2) {
            return array1
        }

        const left = subtract(comparator, array1, array2)
        const right = subtract(comparator, array2, array1)

        return left.concat(right).sort(comparator)
    }

    export const removeDuplicates = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = array1.concat(array2).sort(comparator)
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = i + 1; j < array1.length && comparator(array1[j], src) === 0; j++) {
                    // empty
                }
                if (i - 1 > i) {
                    array1.splice(i + 1, i - i - 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                for (let j = i + 1; j < array1.length && array1[j] === src; j++) {
                    // empty
                }
                if (i - 1 > i) {
                    array1.splice(i + 1, i - i - 1)
                }
            }
        }

        return array2
    }

    export const intersect = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(comparator, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(comparator, ...array2)
        let len2 = array2.length

        if (len2 < array1.length) {
            const c = array2
            array2 = array1
            array1 = c
            len2 = array2.length
        }
        if (comparator) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && comparator((src2 = array2[j]), src) !== 1; j++)
                    if (comparator(src, src2) === 0) {
                        found = true
                        break
                    }
                if (!found) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && src >= (src2 = array2[j]); j++)
                    if (src2 === src) {
                        found = true
                        break
                    }
                if (!found) {
                    array1.splice(i--, 1)
                }
            }
        }

        return array1
    }

    export const union = <T>(comparator: Comparator<T>, array1: T[], array2: T[]): T[] => {
        const array = array1.concat(array2)
        return unsortedRemoveDuplicates(comparator, ...array)
    }

    export const subtract = <T>(compareFunction: Comparator<T>, array1: T[], array2: T[]): T[] => {
        array1 = unsortedRemoveDuplicates(compareFunction, ...array1)
        if (!array2) {
            return array1
        }

        array2 = unsortedRemoveDuplicates(compareFunction, ...array2)
        const len2 = array2.length

        if (compareFunction) {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && compareFunction((src2 = array2[j]), src) !== 1; j++)
                    if (compareFunction(src, src2) === 0) {
                        found = true
                        break
                    }
                if (found) {
                    array1.splice(i--, 1)
                }
            }
        } else {
            for (let i = 0; i < array1.length; i++) {
                const src = array1[i]
                let found = false,
                    src2
                for (let j = 0; j < len2 && src >= (src2 = array2[j]); j++)
                    if (src2 === src) {
                        found = true
                        break
                    }
                if (found) {
                    array1.splice(i--, 1)
                }
            }
        }

        return array1
    }

    export const findArray = (array: number[], subArray: number[]): number => {
        const arrayLen = array.length
        const subArrayLen = subArray.length

        if (0 === arrayLen || 0 === subArrayLen || subArrayLen > arrayLen) {
            return -1
        }

        const len = arrayLen - subArrayLen
        let index = -1
        let flag = false

        const isSubArrayExists = (array: number[], subArray: number[], index: number): boolean => {
            if (subArray[0] === array[index]) {
                for (let j = 1; j < subArray.length; j++) {
                    if (subArray[j] !== array[index + j]) {
                        return false
                    }
                }
                return true
            }
            return false
        }

        for (let i = 0; i <= len; i++) {
            flag = isSubArrayExists(array, subArray, i)
            if (flag) {
                if (len - i < subArrayLen) {
                    return i
                } else {
                    index = i
                }
            }
        }
        return index
    }

    export const trueForAll = <T>(predicate: Predicate<T>, ...array: T[]): boolean => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        predicate = lambda(predicate)
        checkType(predicate, 'function')

        for (let i = 0, _len = array.length; i < _len; i++) {
            if (!predicate(array[i])) {
                return false
            }
        }

        return true
    }

    export const removeAt = <T>(index: number, array: T[]): void => {
        if (!isArray(array)) {
            throw valueError(`incorrect input value: array # 1 < ${array} >`)
        }

        isInRange(index, 0, array.length)

        let _i = index
        const _len = --array.length
        for (; _i < _len; _i++) {
            array[_i] = array[_i + 1]
        }

        delete array[_len]
    }

    /**
     * Inserts an element into the List at the specified index.
     * @param {Number} index The zero-based index at which item should be inserted.
     * @param {Object} item The object to insert.
     * @param array
     */
    export const insert = (index: number, item: any, array: any[]): any[] => {
        checkArray(array)

        if (index !== array.length) {
            isInRange(index, 0, array.length)
        }

        let _len = ++array.length

        while (_len-- > index) {
            array[_len] = array[_len - 1]
        }

        array[index] = item

        return array
    }

    export const search = (arr: any[], num: number, lowest: boolean): number => {
        let start = 0
        let end = arr.length - 1

        while (start <= end) {
            let middle = Math.floor((start + end) / 2)

            if (arr[middle].q.length === num) {
                if (lowest) {
                    while (arr[middle - 1] && arr[middle].q.length === arr[middle - 1].q.length) middle--
                } else {
                    while (arr[middle + 1] && arr[middle].q.length === arr[middle + 1].q.length) middle++
                }

                return middle
            } else if (arr[middle].q.length < num) {
                start = middle + 1
            } else {
                end = middle - 1
            }
        }

        throw new Error('The provided min/max length is out of boundaries.')
    }

    export const flatten = (...args: any[]): any[] => {
        return args.reduce((a, b) => a.concat(b))
    }

    // Алгоритм Фишера-Йетса — отличный пример, он не только несмещенный, но и выполняется
    // за линейное время, использует константную память и легок в реализации.
    export const shuffle2 = (array: any[]): any[] => {
        let n = array.length
        let t, i
        while (n) {
            i = (Math.random() * n--) | 0
            t = array[n]
            array[n] = array[i]
            array[i] = t
        }

        return array
    }

    // Random shuffle an array.
    // https://stackoverflow.com/a/2450976/1413259
    // https://github.com/coolaj86/knuth-shuffle
    export const shuffle3 = (arr: any[]): any[] => {
        let i = arr.length,
            t,
            j
        while (0 !== i) {
            j = Math.floor(Math.random() * i)
            i -= 1
            t = arr[i]
            arr[i] = arr[j]
            arr[j] = t
        }

        return arr
    }

    export const removeValues = (data: any[], ...args: any[]): any[] => {
        for (let i = 0, n = data.length; i < n; i++) {
            for (let j = 0, n = args.length; i < n; i++) {
                if (data[i] === args[j]) {
                    data.splice(i, 1)
                }
            }
        }

        return data
    }

    export const arrayShuffle = (array: any[]): any[] => {
        checkArray(array)

        for (let i = 0; i < array.length; i++) {
            // const l = Math.floor(Math.random() * i + 1);
            const l = Math.floor(Math.random() * array.length)
            Sorting.swap(array, l, i)
        }

        return array
    }

    export const toArray = (arr: any[], from = 0): any[] => {
        return Array.prototype.slice.call(arr, from)
    }

    /**
     * https://jsperf.com/comparison-object-index-type
     * @param {number} count
     * @returns {Object|Array<Object>}
     */
    export const createObjectArray = (count: number): any[] => {
        const array = new Array(count)
        for (let i = 0; i < count; i++) {
            array[i] = createObject()
        }

        return array
    }

    export const createObject = (): any => {
        return Object.create(null)
    }
}
