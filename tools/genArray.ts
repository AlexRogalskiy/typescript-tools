import { Errors } from '../src'
import valueError = Errors.valueError

export class GenArray<T> {
    private readonly subscribers = {}

    static isGenArray(value: any): boolean {
        return value instanceof GenArray
    }

    static from<T>(...elements: T[]): GenArray<T> {
        return new GenArray(elements)
    }

    static checkGenArray<T>(value: GenArray<T>): void {
        if (!GenArray.isGenArray(value)) {
            throw valueError(`not valid GenArray instance: [ ${value} ]`)
        }
    }

    private static is(a, b): boolean {
        return (
            (a === b && (a !== 0 || 1 / a === 1 / b)) || // false for +0 vs -0
            (a !== a && b !== b)
        )
    }

    /**
     * Default {@link Color} constructor by input parameters
     * @param elements
     */
    constructor(private readonly elements: T[]) {
        this.elements = JSON.parse(JSON.stringify(elements))
    }

    length(): number {
        return this.elements.length
    }

    isEmpty(): boolean {
        return this.length() === 0
    }

    reset(): void {
        this.elements.splice(0)
    }

    clone(): GenArray<T> {
        return GenArray.from(...this.elements)
    }

    toString(): string {
        return `(elements: ${this.elements})`
    }

    equals(obj: any): boolean {
        GenArray.checkGenArray(obj)

        return (
            this.elements.length === obj.elements.length &&
            this.elements.every(function (u, i) {
                // Use "is" instead of "==="
                return GenArray.is(u, obj.elements[i])
            })
        )
    }

    after(existingFn, newFn): void {
        let pos = this.elements.indexOf(existingFn)

        if (pos === -1) {
            throw new Error('Cannot find existingFn')
        }

        pos = pos + 1
        this.elements.splice(pos, 0, newFn)
    }

    before(existingFn, newFn): void {
        const pos = this.elements.indexOf(existingFn)

        if (pos === -1) {
            throw new Error('Cannot find existingFn')
        }

        this.elements.splice(pos, 0, newFn)
    }

    remove(fn): void {
        const pos = this.elements.indexOf(fn)

        if (pos === -1) {
            return
        }

        this.elements.splice(pos, 1)
    }

    run(tokens: any[]): any[] {
        const stackLength = this.elements.length

        for (let i = 0; i < stackLength; i++) {
            const fn: any = this.elements[i]
            const memo: any[] = []

            for (let j = 0; j < tokens.length; j++) {
                const result = fn(tokens[j], j, tokens)

                if (result === null || result === void 0 || result === '') continue

                if (Array.isArray(result)) {
                    for (const item of result) {
                        memo.push(item)
                    }
                } else {
                    memo.push(result)
                }
            }

            tokens = memo
        }

        return tokens
    }

    positionForIndex(index: T): number {
        // For an empty vector the tuple can be inserted at the beginning
        if (this.isEmpty()) {
            return 0
        }

        let start = 0,
            end = this.elements.length / 2,
            sliceLength = end - start,
            pivotPoint = Math.floor(sliceLength / 2),
            pivotIndex = this.elements[pivotPoint * 2]

        while (sliceLength > 1) {
            if (pivotIndex < index) {
                start = pivotPoint
            }

            if (pivotIndex > index) {
                end = pivotPoint
            }

            if (pivotIndex === index) {
                break
            }

            sliceLength = end - start
            pivotPoint = start + Math.floor(sliceLength / 2)
            pivotIndex = this.elements[pivotPoint * 2]
        }

        if (pivotIndex === index) {
            return pivotPoint * 2
        }

        if (pivotIndex > index) {
            return pivotPoint * 2
        }

        if (pivotIndex < index) {
            return (pivotPoint + 1) * 2
        }

        return 0
    }

    insert(insertIdx, val): void {
        this.upsert(insertIdx, val, () => {
            throw valueError('duplicate index')
        })
    }

    upsert(insertIdx, val, fn): void {
        const position = this.positionForIndex(insertIdx)

        if (this.elements[position] === insertIdx) {
            this.elements[position + 1] = fn(this.elements[position + 1], val)
        } else {
            this.elements.splice(position, 0, insertIdx, val)
        }
    }

    on(event: string, cb: any): void {
        const list: any[] = this.subscribers[event]
        if (list && list.indexOf(cb) === 0) {
            list.push(cb)
        } else {
            this.subscribers[event] = [cb]
        }
    }

    notify(event: string): void {
        const list: any[] = this.subscribers[event]
        if (list) {
            for (const cb of list) {
                cb()
            }
        }
    }
}
