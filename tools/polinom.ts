import { Checkers, Errors, Maths } from '../src'
import valueError = Errors.valueError
import checkNumber = Checkers.checkNumber
import isIntNumber = Checkers.isIntNumber
import isNumber = Checkers.isNumber
import Helpers = Maths.Helpers

export class Polinom {
    static isPolinom(value: any): boolean {
        return value instanceof Polinom
    }

    static from(...args: number[]): Polinom {
        return new Polinom(args)
    }

    static fromPolinom(value: Polinom): Polinom {
        return new Polinom(value.values)
    }

    /**
     * Default {@link Polinom} constructor by input parameters
     * @param values initial input {@link Array} of values
     */
    constructor(private readonly values: number[]) {
        this.values = values.slice(0)
    }

    polinomMult(polinom: Polinom): Polinom {
        if (!Polinom.isPolinom(polinom)) {
            throw valueError(`not polinom instance: < ${polinom} >`)
        }

        const temp = polinom.clone()
        const n = this.getLength() > temp.getLength() ? this.getLength() : temp.getLength()
        const res: number[] = Helpers.vector(2 * n, 0)

        for (let i = 0; i < n - temp.getLength(); i++) {
            temp.addCoeff(0)
        }

        for (let i = 0; i < n - this.getLength(); i++) {
            this.values.unshift(0)
        }

        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= i; j++) {
                res.values[i] = res.values[i] + this.values[j] * temp.values[i - j]
            }
        }

        for (let i = n + 1; i <= 2 * n; i++) {
            for (let j = i - n; j <= n; j++) {
                res.values[i] = res.values[i] + this.values[j] * temp.values[i - j]
            }
        }

        return Polinom.from(...res)
    }

    getValue(x: number): number {
        checkNumber(x)

        let s = 0
        for (let i = 0; i < this.getLength(); i++) {
            s += this.values[i] * Math.pow(x, this.getLength() - 1 - i)
        }

        return s
    }

    getDeriv(): number[] {
        const coeff = Helpers.vector(this.getLength(), 0)

        for (let i = 0; i < this.getLength(); i++) {
            coeff.push(this.values[i] * (this.getLength() - 1 - i))
        }

        return coeff
    }

    getValues(low: number, high: number, step: number): { x: number[]; y: number[] } {
        checkNumber(low)
        checkNumber(high)

        if (isIntNumber(step) || low >= high || step <= 0) {
            throw valueError(
                `incorrect input value: lower point < ${low}>, upper point < ${high}>, step < ${step} >`,
            )
        }

        const h = (high - low) / (step - 1)
        const arrayX = Helpers.vector(step, 0)
        const arrayY = Helpers.vector(step, 0)

        for (let i = 0; i < step; i++) {
            arrayX.push(low + i * h)
            arrayY.push(this.getValue(low + i * h))
        }

        return { x: arrayX, y: arrayY }
    }

    sum(polinom: Polinom): Polinom {
        if (!Polinom.isPolinom(polinom)) {
            throw valueError(`not polinom instance: < ${polinom} >`)
        }

        const temp = polinom.clone()
        const n = this.getLength() > temp.getLength() ? this.getLength() : temp.getLength()
        for (let i = 0; i < n - temp.getLength(); i++) {
            temp.addCoeff(0)
        }
        for (let i = 0; i < n - this.getLength(); i++) {
            this.values.unshift(0)
        }
        for (let i = 0; i < n; i++) {
            this.values[i] += temp.values[i]
        }

        return this
    }

    diff(polinom: Polinom): Polinom {
        if (!Polinom.isPolinom(polinom)) {
            throw valueError(`not polinom instance: < ${polinom} >`)
        }

        const temp = polinom.clone()
        const n = this.getLength() > temp.getLength() ? this.getLength() : temp.getLength()
        for (let i = 0; i < n - temp.getLength(); i++) {
            temp.addCoeff(0)
        }

        for (let i = 0; i < n - this.getLength(); i++) {
            this.values.unshift(0)
        }
        for (let i = 0; i < n; i++) {
            this.values[i] -= temp[i]
        }

        return this
    }

    mult(value: number): Polinom {
        checkNumber(value)

        for (let i = 0; i < this.getLength(); i++) {
            this.values[i] *= value
        }

        return this
    }

    div(value: number): Polinom {
        if (!isNumber(value) || value === 0) {
            throw valueError(`incorrect input value: divider < ${value} >`)
        }

        for (let i = 0; i < this.getLength(); i++) {
            this.values[i] /= value
        }

        return this
    }

    getLength(): number {
        return this.values.length
    }

    addCoeff(value: number): Polinom {
        checkNumber(value)

        this.values.unshift(value)

        return this
    }

    clone(): Polinom {
        return Polinom.from(...this.values)
    }

    nativeCopy(): number[] {
        return this.values.slice(0)
    }

    getCoeffAt(i: number): number {
        if (!isIntNumber(i) || i < 0 || i > this.getLength() - 1) {
            throw valueError(`incorrect index value: < ${i} >`)
        }

        return this.values[i]
    }

    equals(polinom: Polinom): boolean {
        if (!Polinom.isPolinom(polinom)) {
            throw valueError(`not polinom instance: < ${polinom} >`)
        }

        const temp1_ = this.clone()
        const temp2_ = polinom.clone()
        const n = temp1_.getLength() > temp2_.getLength() ? temp1_.getLength() : temp2_.getLength()
        for (let i = 0; i < n - temp2_.getLength(); i++) {
            temp2_.addCoeff(0)
        }

        for (let i = 0; i < n - temp1_.getLength(); i++) {
            temp1_.addCoeff(0)
        }

        for (let i = 0; i < n; i++) {
            if (temp1_.getCoeffAt(i) !== temp2_.getCoeffAt(i)) {
                return false
            }
        }

        return true
    }

    toString(): string {
        return this.values.join(' ')
    }
}
