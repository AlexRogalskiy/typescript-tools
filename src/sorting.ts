import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { Maths } from './maths'
import { Comparators } from './comparators'

export namespace Sorting {
    import isFunction = Checkers.isFunction
    import valueException = Exceptions.valueException
    import isArray = Checkers.isArray
    import isIntNumber = Checkers.isIntNumber
    import typeException = Exceptions.typeException
    import Comparator = Comparators.Comparator
    import cmpByDefault = Comparators.cmpByDefault
    import Helpers = Maths.Helpers

    /**
     * @private
     * @module sorting
     * @param data Input {Array}.
     * @param index1 index {Integer}.
     * @param index2 index {Integer} to swap_ with.
     */
    export const swap = <T>(data: T[], index1: number, index2: number): void => {
        if (index1 !== index2) {
            const temp = data[index2]
            data[index2] = data[index1]
            data[index1] = temp
        }
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Sorted Array
     *
     * best time: O(n)
     * average time: O(n * n)
     * worst time: O(n * n)
     * memory: in-place
     * stable: true
     */
    export const bubbleSort = <T>(array: T[], cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        const n = array.length
        let swapped

        do {
            swapped = false
            for (let i = 1; i < n; i++) {
                if (cmp(array[i - 1], array[i]) > 0) {
                    swap(array, i - 1, i)
                    swapped = true
                }
            }
        } while (swapped !== false)

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     */
    export const bucketSort = (array: number[], cmp: Comparator<number>): number[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: not array < ${array} >`)
        }
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        if (array.length < 2) {
            return array
        }

        let minVal = array[0],
            maxVal = array[0]
        for (let i = 1; i < array.length; i++) {
            if (cmp(array[i], maxVal) > 0) {
                maxVal = array[i]
            }
            if (cmp(array[i], minVal) < 0) {
                minVal = array[i]
            }
        }

        // Создание временного массива "карманов" в количестве,
        // достаточном для хранения всех возможных элементов,
        // чьи значения лежат в диапазоне между minValue и maxValue.
        // Т.е. для каждого элемента массива выделяется "карман" List<int>.
        // При заполнении данных "карманов" элементы исходного не отсортированного массива
        // будут размещаться в порядке возрастания собственных значений "слева направо".
        const bucket: number[][] = Helpers.matrix(maxVal - minVal + 1, 0, 0)
        for (const item of array) {
            // Занесение значений в пакеты
            bucket[item - minVal].push(item)
        }

        // Восстановление элементов в исходный массив
        // из карманов в порядке возрастания значений
        let pos = 0
        for (const item of bucket) {
            if (item.length > 0) {
                for (const subItem of item) {
                    array[pos++] = item[subItem]
                }
            }
        }

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * @example
     * var sort = require('path-to-algorithms/src/sorting/shellsort').shellSort;
     * console.log(sort([2, 5, 1, 0, 4])); // [ 0, 1, 2, 4, 5 ]
     *
     */
    export const shellSort = (() => {
        const steps = [701, 301, 132, 57, 23, 10, 4, 1]

        return <T>(array: T[], cmp: Comparator<T>): T[] => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault
            for (const gap of steps) {
                for (let i = gap; i < array.length; i += gap) {
                    const current = array[i]
                    for (let j = i; j >= gap && cmp(array[j - gap], current) > 0; j -= gap) {
                        array[j] = array[j - gap]
                    }
                    array[i] = current
                }
            }
            return array
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Integer} step Sorting step.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * @example
     * var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
     * var initArraySorted = shellSort(initArray, initArray.length);
     * document.writeln("shellSort: " + initArraySorted);
     *
     */
    export const shellSort2 = <T>(array: T[], step: number, cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        step = isIntNumber(step) && step > 0 ? step : array.length
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        let isSorted
        for (let gap = Math.floor(step / 2); gap > 0; gap = Math.floor(gap / 2)) {
            do {
                isSorted = 0
                for (let i = 0, j = gap; j < step; i++, j++) {
                    if (cmp(array[i], array[j]) > 0) {
                        swap(array, i, j)
                        isSorted = 1
                    }
                }
            } while (isSorted)
        }

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * @example
     * var res = globals.algorithms.shellsort([3, 4, 4, 5, 6, 6]);
     * document.writeln('shellsort: ' + res);
     *
     */
    export const shellsort3 = <T>(array: T[], cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        cmp = isFunction(cmp) ? cmp : cmpByDefault

        let temp,
            gap = 1
        const n = array.length
        do {
            gap = 3 * gap + 1
        } while (gap <= n)

        for (gap /= 3; gap > 0; gap /= 3) {
            for (let i = gap; i < n; i++) {
                temp = array[i]
                for (let j = i - gap; j >= 0 && cmp(array[j], temp) > 0; j -= gap) {
                    array[j + gap] = array[j]
                }
                array[i + gap] = temp
            }
        }

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Integer} left Left border.
     * @param {Integer} right Right border.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * @example
     * var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
     * var initArraySorted = globals.algorithms.hooraSort(initArray, 0, 10);
     * document.writeln("hooraSort: " + initArraySorted);
     *
     */
    export const hooraSort = (() => {
        const hoora = <T>(a: T[], l: number, r: number, cmp: Comparator<T>): void => {
            if (l >= r) return

            swap(a, l, Math.floor((l + r) / 2))
            let las = l
            for (let i = l + 1; i <= r; i++) {
                if (cmp(a[i], a[las]) > 0) {
                    swap(a, ++las, i)
                }
            }
            swap(a, l, las)

            hoora(a, l, las - 1, cmp)
            hoora(a, las + 1, r, cmp)
        }

        return <T>(array: T[], left: number, right: number, cmp: Comparator<T>) => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameters: array < ${array} >`)
            }

            left = isIntNumber(left) && left > 0 ? left : 0
            right = isIntNumber(right) && right > 0 ? right : array.length
            cmp = isFunction(cmp) ? cmp : cmpByDefault

            hoora(array, left, right, cmp)

            return array
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * @example
     * var res = globals.algorithms.insertionSort([3, 4, 4, 5, 6, 6]);
     * document.writeln('insertsort: ' + res);
     *
     * best time: O(n)
     * average time: O(n*n)
     * worst time: O(n*n)
     * memory: local
     * stable: true
     *
     */
    export const insertionSort2 = <T>(array: T[], cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        cmp = isFunction(cmp) ? cmp : cmpByDefault

        let temp
        for (let i = 1; i < array.length; i++) {
            temp = array[i]
            for (let j = i - 1; j >= 0 && cmp(array[j], temp) > 0; j--) {
                array[j + 1] = array[j]
            }
            array[i + 1] = temp
        }

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     *
     * best time: O(n)
     * average time: O(n*n)
     * worst time: O(n*n)
     * memory: in-place
     * stable: false
     */
    export const selectionSort = (() => {
        const findMinimumIndex = <T>(data: T[], start: number, cmp: Comparator<T>): number => {
            let minPos = start
            for (let i = start + 1; i < data.length; i++) {
                if (cmp(data[i], data[minPos]) < 0) {
                    minPos = i
                }
            }

            return minPos
        }

        const selectionSortRecursive = <T>(data: T[], start: number, cmp: Comparator<T>): void => {
            swap(data, start, findMinimumIndex(data, start, cmp))
            selectionSortRecursive(data, start + 1, cmp)
        }

        return <T>(array: T[], start: number, cmp: Comparator<T>) => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault
            start = isIntNumber(start) && start >= 0 && start < array.length - 1 ? start : 0

            if (start === null) return

            selectionSortRecursive(array, start, cmp)
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array.
     *
     * best time: O(nlog(n))
     * average time: O(nlog(n))
     * worst time: O(nlog(n))
     * memory: O(n)
     * stable: false
     */
    export const mergeSort = (() => {
        const MIN_LENGTH = 10

        const merge = <T>(dest: T[], left: T[], right: T[], cmp: Comparator<T>): T[] => {
            let dind = 0,
                lind = 0,
                rind = 0,
                order
            while (lind < left.length && rind < right.length) {
                order = cmp(left[lind], right[rind])
                if (order <= 0) {
                    dest[dind++] = left[lind++]
                } else {
                    dest[dind++] = right[rind++]
                }
            }
            while (lind < left.length) dest[dind++] = left[lind++]
            while (rind < right.length) dest[dind++] = right[rind++]

            return dest
        }

        const mergeSortSimple = <T>(data: T[], cmp: Comparator<T>): T[] => {
            if (data.length < 2) {
                return data
            }
            if (data.length < MIN_LENGTH) {
                return insertionSort2(data, cmp)
            }

            const mid = Math.floor(data.length / 2)
            const left = data.slice(0, mid)
            const right = data.slice(mid, data.length)

            mergeSortSimple(left, cmp)
            mergeSortSimple(right, cmp)

            return merge(data, left, right, cmp)
        }

        return <T>(array: T[], cmp: Comparator<T>): T[] => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault

            return mergeSortSimple(array, cmp)
        }
    })()

    export const mergeSort2 = (() => {
        const merge = <T>(data: T[], low, middle, high, cmp: Comparator<T>): void => {
            const helper: T[] = []
            for (let i = low; i <= high; i++) {
                helper[i] = data[i]
            }
            let helperLeft = low
            let helperRight = middle + 1
            let current = low

            while (helperLeft <= middle && helperRight <= high) {
                if (cmp(helper[helperLeft], helper[helperRight]) <= 0) {
                    data[current] = helper[helperLeft]
                    helperLeft++
                } else {
                    data[current] = helper[helperRight]
                    helperRight++
                }
                current++
            }
            const remaining = middle - helperLeft
            for (let i = 0; i <= remaining; i++) {
                data[current + i] = helper[helperLeft + i]
            }
        }

        const mergeSort_ = <T>(data: T[], low: number, high: number, cmp: Comparator<T>): void => {
            if (low < high) {
                const middle = Math.floor((low + high) / 2)
                mergeSort_(data, low, middle, cmp)
                mergeSort_(data, middle + 1, high, cmp)

                merge(data, low, middle, high, cmp)
            }
        }

        return <T>(array: T[], cmp: Comparator<T>) => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault

            return mergeSort_(array, 0, array.length, cmp)
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     *
     * best time: O(nlog(n))
     * average time: O(nlog(n))
     * worst time: O(n * n)
     * memory: in-place
     * stable: false
     */
    export const quicksortOptimized = (() => {
        const quicksort = <T>(data: T[], left: number, right: number, cmp: Comparator<T>): void => {
            const pivotValue = data[Math.floor((left + right) / 2)]
            let i = left
            let j = right

            while (i <= j) {
                while (cmp(data[i], pivotValue) < 0) i++
                while (cmp(data[j], pivotValue) > 0) j--
                if (i <= j) {
                    swap(data, i, j)
                    i++
                    j--
                }
            }

            if (left < j) {
                quicksort(data, left, j, cmp)
            }

            if (i < right) {
                quicksort(data, i, right, cmp)
            }
        }

        return <T>(array: T[], cmp: Comparator<T>): void => {
            if (!isArray(array)) {
                throw valueException(`incorrect input array: < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault
            quicksort(array, 0, array.length - 1, cmp)
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array
     *
     * @example
     * var initArray = [0, 100, 5, 1, 3, 4, 213, 4, 2, 4, 4];
     * var initArraySorted = globals.algorithms.quickSort(initArray);
     * document.writeln("quickSort: " + initArraySorted);
     *
     * best time: O(nlog(n))
     * average time: O(nlog(n))
     * worst time: O(n * n)
     * memory: in-place
     * stable: false
     */
    export const quickSort = <T>(array: T[], cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input array: < ${array} >`)
        }

        cmp = isFunction(cmp) ? cmp : cmpByDefault

        const leftStack: number[] = []
        const rightStack: number[] = []

        let sp = 1
        let left, right, i, j

        leftStack[1] = 1
        rightStack[1] = array.length - 1

        while (sp > 0) {
            left = leftStack[sp]
            right = rightStack[sp]
            sp--
            while (cmp(left, right) < 0) {
                i = left
                j = right

                const middle = array[Math.floor((left + right) / 2)]
                while (i < j) {
                    while (cmp(array[i], middle) < 0) i++
                    while (cmp(array[j], middle) > 0) j--
                    if (i <= j) {
                        swap(array, i, j)
                        i++
                        j--
                    }
                }

                if (i < right) {
                    sp++
                    leftStack[sp] = i
                    rightStack[sp] = right
                }
                right = j
            }
        }

        return array
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Integer} min start index.
     * @param {Integer} max end index.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Sorted array
     *
     * @example
     * var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
     * document.writeln('heapSort: ' + res);
     */
    // export const heapsort = <T>(array: T[], min: number, max: number, cmp: Comparator<T>): T[] => {
    //     if (!isArray(array)) {
    //         throw valueException(`incorrect input parameter: array < ${array} >`)
    //     }
    //
    //     min = isIntNumber(min) && min > 0 && min < array.length ? min : 0
    //     max = isIntNumber(max) && max > 0 && max < array.length ? max : array.length - 1
    //
    //     if (min > max) {
    //         throw valueException(`incorrect min or max value: min < ${min} >, max < ${max} >`)
    //     }
    //
    //     cmp = isFunction(cmp) ? cmp : cmpByDefault
    //
    //     const heap = maxHeap(array.slice(min, max + 1), cmp),
    //         result = []
    //     while (!heap.isEmpty()) {
    //         result.push(heap.poll())
    //     }
    //
    //     //return heap.postorderTraversal()
    //     return result
    // }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array
     *
     * @example
     * var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
     * document.writeln('heapSort: ' + res);
     */
    export const heapsort2 = (() => {
        const adjust = <T>(data: T[], m: number, n: number, cmp: Comparator<T>): void => {
            let j = m,
                k = 2 * m

            while (k <= n) {
                if (k < n && cmp(data[k - 1], data[k]) < 0) ++k
                if (cmp(data[j - 1], data[k - 1]) < 0) swap(data, j - 1, k - 1)
                j = k
                k *= 2
            }
        }

        return <T>(array: T[], cmp: Comparator<T>) => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }
            cmp = isFunction(cmp) ? cmp : cmpByDefault

            const n = array.length
            for (let j = Math.floor(n / 2); j > 0; j--) {
                adjust(array, j, n, cmp)
            }
            for (let j = n - 1; j > 0; j--) {
                swap(array, 0, j)
                adjust(array, 1, j, cmp)
            }

            return array
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array
     *
     * @example
     * var res = globals.algorithms.heapsort([3, 4, 5, 2, 1, 4, 4, 2, 5, 1, 6, 2, 4]);
     * document.writeln('heapSort: ' + res);
     */
    export const heapsort3 = (() => {
        const siftup = <T>(data: T[], pos: number, n: number, cmp: Comparator<T>): void => {
            let temp, order
            while ((temp = 2 * pos + 1) < n) {
                order = cmp(data[2 * pos + 2], data[temp])
                if (2 * pos + 2 < n && order >= 0) {
                    temp = 2 * pos + 2
                }
                if (cmp(data[pos], data[temp]) < 0) {
                    swap(data, pos, temp)
                    pos = temp
                } else {
                    break
                }
            }
            //for(var p, i=pos; i>=1 && array[p=Math.floor(i/2)] < array[i]; i=p) {
            //	swap_(p, i);
            //}
        }

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const siftdown = <T>(data: T[], value: number, cmp: Comparator<T>): void => {
            for (let c, order, i = value; (c = 2 * i) <= data.length; i = c) {
                if (c + 1 <= data.length && cmp(data[c + 1], data[c]) > 0) {
                    c++
                }

                order = cmp(data[i], data[c])
                if (order >= 0) return
                swap(data, c, i)
            }
        }

        return <T>(array: T[], cmp: Comparator<T>): T[] => {
            if (!isArray(array)) {
                throw valueException(`incorrect input parameter: array < ${array} >`)
            }

            cmp = isFunction(cmp) ? cmp : cmpByDefault

            const n = array.length
            for (let i = n - 1; i >= 0; i--) {
                siftup(array, i, n, cmp)
            }
            for (let i = n - 1; i > 0; i) {
                swap(array, 0, i)
                siftup(array, 0, i--, cmp)
            }

            // for (let i = array.length - 1; i >= 1; i--) {
            //     swap(array, 0, i)
            //     siftdown(array, i - 1, cmp)
            // }

            return array
        }
    })()

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Current sorted array
     */
    // export const pqsort = <T>(array: T[], cmp: Comparator<T>): T[] => {
    //     if (!isArray(array)) {
    //         throw valueException(`incorrect input parameter: array < ${array} >`)
    //     }
    //
    //     cmp = isFunction(cmp) ? cmp : cmpByDefault
    //
    //     const pq = priqueue(array, cmp)
    //     //for(var i=0; i<array.length; i++) {
    //     //	pq.insert(array[i]);
    //     //}
    //     for (let i = 0; i < array.length; i++) {
    //         array[i] = pq.extractmin()
    //     }
    //
    //     return array
    // }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     */
    export const insertionSort = <T>(array: T[], cmp: Comparator<T>): void => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        cmp = isFunction(cmp) ? cmp : cmpByDefault

        for (let i = 1; i < array.length; i++) {
            const temp = array[i]
            for (let j = i; j > 0 && cmp(array[j - 1], temp) > 0; j--) {
                array[j] = array[j - 1]
            }
            array[i] = temp
        }
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Integer} min start index.
     * @param {Integer} max end index.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     */
    export const sort = <T>(array: T[], min: number, max: number, cmp: Comparator<T>): void => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        min = isIntNumber(min) && min > 0 ? min : 0
        max = isIntNumber(max) && max > 0 ? max : array.length - 1
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        if (min > max) {
            throw valueException(`incorrect min or max value: min < ${min} >, max < ${max} >`)
        }

        for (let i = min; i < max; i++) {
            for (let j = i; j > 0 && cmp(array[j - 1], array[j]) > 0; j--) {
                swap(array, j - 1, j)
            }
        }
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     */
    export const gnomeSort = <T>(array: T[], cmp: Comparator<T>): void => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        const n = array.length
        let i = 1
        let j = 2
        while (i < n) {
            if (cmp(array[i - 1], array[i]) < 0) {
                i = j
                j++
            } else {
                swap(array, i - 1, i)
                if (--i === 0) {
                    i = j
                    j++
                }
            }
        }
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     */
    export const cocktailSort = <T>(array: T[], cmp: Comparator<T>): void => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }
        cmp = isFunction(cmp) ? cmp : cmpByDefault

        let j = array.length - 1
        let i = 0
        let flag = true

        while (i < j && flag) {
            flag = false
            for (let k = i; k < j; k++) {
                if (cmp(array[k], array[k + 1]) > 0) {
                    swap(array, k, k + 1)
                    flag = true
                }
            }
            j--
            if (flag) {
                flag = false
                for (let k = j; k > i; k--) {
                    if (cmp(array[k], array[k - 1]) < 0) {
                        swap(array, k, k - 1)
                        flag = true
                    }
                }
            }
            i++
        }
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Sorted Array
     */
    export const simpleCountSort = <T>(array: T[], cmp: Comparator<T>): T[] => {
        if (!isArray(array)) {
            throw valueException(`incorrect input parameter: array < ${array} >`)
        }

        cmp = isFunction(cmp) ? cmp : cmpByDefault

        const n = array.length
        const count = Helpers.vector(n, 0)
        const res: T[] = []

        for (let i = 0; i < n - 1; i++) {
            for (let j = i + 1; j < n; j++) {
                if (cmp(array[i], array[j]) < 0) {
                    count[j]++
                } else {
                    count[i]++
                }
            }
        }

        for (let i = 0; i < n; i++) {
            res[count[i]] = array[i]
        }

        return res
    }

    /**
     * @public
     * @module sorting
     * @param {Array} array Input array.
     * @param {Function} cmp Optional. A function that defines an
     * alternative sort order. The function should return a negative,
     * zero, or positive value, depending on the arguments.
     * @return {Array} Sorted Array
     */
    export const combSort = (() => {
        const getGap = (gap: number): number => {
            gap = Math.floor(gap / 1.3)
            if (gap === 9 || gap === 10) gap = 11
            if (gap < 1) {
                return 1
            }
            return gap
        }

        return <T>(array: T[], cmp: Comparator<T>): void => {
            if (!isArray(array)) {
                throw typeException(`incorrect input argument: not array < ${array} >`)
            }
            cmp = isFunction(cmp) ? cmp : cmpByDefault

            const n = array.length
            let gap = n,
                flag
            do {
                flag = false
                gap = getGap(gap)
                for (let i = 0; i < n - gap; i++) {
                    if (cmp(array[i], array[i + gap]) > 0) {
                        flag = true
                        swap(array, i + gap, i)
                    }
                }
            } while (gap > 1 || flag)
        }
    })()
}
