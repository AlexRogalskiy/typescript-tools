export namespace Mixins {
    // To get started, we need a type which we'll use to extend
    // other classes from. The main responsibility is to declare
    // that the type being passed in is a class.
    type Constructor = new (...args: any[]) => {}

    // This mixin adds a scale property, with getters and setters
    // for changing it with an encapsulated private property:
    export const Scale = <TBase extends Constructor>(Base: TBase): any => {
        return class Scaling extends Base {
            // Mixins GConstructor not declare private/protected properties
            // however, you can use ES2020 private fields
            private _scale = 1

            setScale(scale: number): void {
                this._scale = scale
            }

            get scale(): number {
                return this._scale
            }
        }
    }
}
