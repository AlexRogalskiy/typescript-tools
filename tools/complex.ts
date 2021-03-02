import { Checkers, Errors } from '../src'
import valueError = Errors.valueError
import isNumber = Checkers.isNumber

export class Complex {
    private static convertToAlg(r: number, phi: number): { x: number; y: number } {
        const x = r * Math.cos(phi)
        const y = r * Math.sin(phi)

        return { x, y }
    }

    private static convertToTrig(x: number, y: number): { r: number; phi: number } {
        const r = Math.sqrt(x * x + y * y)
        const phi = Math.atan2(y, x)

        return { r, phi }
    }

    static isComplex(value: any): boolean {
        return value instanceof Complex
    }

    static fromAlg(x: number, y: number): Complex {
        return new Complex(x, y)
    }

    static fromTrig(r: number, phi: number): Complex {
        const data = Complex.convertToAlg(r, phi)
        return new Complex(data.x, data.y)
    }

    static fromComplex(value: Complex): Complex {
        return new Complex(value.x, value.y)
    }

    /**
     * Default {@link Complex} constructor by input parameters
     * @param x initial input {@link Number} x
     * @param y initial input {@link Number} y
     */
    constructor(private x: number, private y: number) {
        this.x = x
        this.y = y
    }

    toAlgebraicString(): string {
        return `(${this.x.toFixed(3)} + ${this.y.toFixed(3)} * i)`
    }

    toTrigonometricString(): string {
        const data = Complex.convertToTrig(this.x, this.y)
        return `(${data.r.toFixed(3)} * exp(${data.phi.toFixed(3)} * i))`
    }

    add(complex: Complex): void {
        if (!Complex.isComplex(complex)) {
            throw valueError(`not complex number instance: < ${complex} >`)
        }

        this.x += complex.x
        this.y += complex.y
    }

    sub(complex: Complex): void {
        if (!Complex.isComplex(complex)) {
            throw valueError(`not complex number instance: < ${complex} >`)
        }

        this.x -= complex.x
        this.y -= complex.y
    }

    mult(complex: Complex): Complex {
        if (!Complex.isComplex(complex)) {
            throw valueError(`not complex number instance: < ${complex} >`)
        }

        const cxx = this.x * complex.x - this.y * complex.y
        const cyy = this.x * complex.y + this.y * complex.x
        // const cxx = cr * complex2.getR() * Math.cos(cphi + complex2.getPhi());
        // const cyy = cr * complex2.getR() * Math.sin(cphi + complex2.getPhi());

        return new Complex(cxx, cyy)
    }

    div(complex: Complex): Complex {
        if (!Complex.isComplex(complex)) {
            throw valueError(`not complex number instance: < ${complex} >`)
        }

        const denom = complex.x * complex.x + complex.y * complex.y
        const cxx = (this.x * complex.x + this.y * complex.y) / denom
        const cyy = (this.y * complex.x - this.x * complex.y) / denom
        // const cxx = (cr / complex2.getR()) * Math.cos(cphi - complex2.getPhi());
        // const cyy = (cr / complex2.getR()) * Math.sin(cphi - complex2.getPhi());

        return new Complex(cxx, cyy)
    }

    scale(value: number): void {
        if (!isNumber(value) || value === 0) {
            throw valueError(`incorrect input value: scale < ${value} >`)
        }

        this.x /= value
        this.y /= value
    }

    addnum(value: number): void {
        if (!isNumber(value)) {
            throw valueError(`incorrect input value: number < ${value} >`)
        }

        this.x += value
    }

    subnum(value: number): void {
        if (!isNumber(value)) {
            throw valueError(`incorrect input value: number < ${value} >`)
        }

        this.x -= value
    }

    exp(): Complex {
        const cxx = Math.exp(this.x) * Math.cos(this.y)
        const cyy = Math.exp(this.x) * Math.sin(this.y)

        return new Complex(cxx, cyy)
    }

    power(num: number): Complex {
        if (!isNumber(num)) {
            throw valueError(`incorrect power value: < ${num} >`)
        }
        const data = Complex.convertToTrig(this.x, this.y)
        const rr = Math.pow(data.r, num)
        const rphi = num * data.phi

        const cxx = rr * Math.cos(rphi)
        const cyy = rr * Math.sin(rphi)

        return new Complex(cxx, cyy)
    }

    sqrt(): Complex[] {
        const data = Complex.convertToTrig(this.x, this.y)
        const rr = Math.sqrt(data.r)
        const rphi = data.phi / 2

        const cxx = rr * Math.cos(rphi)
        const cyy = rr * Math.sin(rphi)

        return [new Complex(cxx, cyy), new Complex(cxx, -cyy)]
    }

    cos(): Complex {
        const cxx = Math.cos(this.x) * ((Math.exp(this.y) + Math.exp(-this.y)) / 2)
        const cyy = Math.sin(this.x) * ((Math.exp(this.y) - Math.exp(-this.y)) / 2)

        return new Complex(cxx, cyy)
    }

    sin(): Complex {
        const cxx = Math.sin(this.x) * ((Math.exp(this.y) + Math.exp(-this.y)) / 2)
        const cyy = -Math.cos(this.x) * ((Math.exp(this.y) - Math.exp(-this.y)) / 2)

        return new Complex(cxx, cyy)
    }

    ch(): Complex {
        const cxx = ((Math.exp(this.x) + Math.exp(-this.x)) / 2) * Math.cos(this.y)
        const cyy = -((Math.exp(this.x) - Math.exp(-this.x)) / 2) * Math.sin(this.y)

        return new Complex(cxx, cyy)
    }

    sh(): Complex {
        const cxx = -((Math.exp(this.x) - Math.exp(-this.x)) / 2) * Math.cos(this.y)
        const cyy = ((Math.exp(this.x) + Math.exp(-this.x)) / 2) * Math.sin(this.y)

        return new Complex(cxx, cyy)
    }

    ln(): Complex {
        const data = Complex.convertToTrig(this.x, this.y)
        const rr = Math.log(data.r)

        return Complex.fromTrig(rr, data.phi)
    }

    log10(): Complex {
        const data = Complex.convertToTrig(this.x, this.y)
        const rr = (1 / Math.LN10) * Math.log(data.r) //Math.log(x) / Math.LN10
        const rphi = (1 / Math.LN10) * data.phi

        return Complex.fromTrig(rr, rphi)
    }

    log2(): Complex {
        const data = Complex.convertToTrig(this.x, this.y)
        const rr = (1 / Math.LN2) * Math.log(data.r) //Math.log(x) / Math.LN2
        const rphi = (1 / Math.LN2) * data.phi

        return new Complex(rr, rphi)
    }

    equals(obj: any): boolean {
        if (!Complex.isComplex(obj)) {
            throw valueError(`not complex instance: < ${obj} >`)
        }

        return this.x === obj.x && this.y === obj.x
    }

    clone(): Complex {
        return Complex.fromAlg(this.x, this.y)
    }

    complement(): Complex {
        return Complex.fromAlg(this.x, -this.y)
    }
}
