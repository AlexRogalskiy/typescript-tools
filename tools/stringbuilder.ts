export class StringBuilder {
    private static current: StringBuilder

    static add(value: string): { valueOf: () => string } {
        StringBuilder.current.data += value

        return {
            valueOf(): string {
                return StringBuilder.current.toString()
            },
        }
    }

    constructor(private data = '') {
        this.data = data
    }

    add(value: string): StringBuilder {
        this.data += value

        return this
    }

    reset(): void {
        this.data = ''
    }

    valueOf(): string {
        StringBuilder.current = this
        return this.toString()
    }

    toString(): string {
        return this.data
    }
}
