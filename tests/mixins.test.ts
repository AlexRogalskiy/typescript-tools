import { describe, test } from '@jest/globals'

import { Mixins } from '../src'

export namespace Mixins_Test {
    import Scale = Mixins.Scale

    type GConstructor<T = {}> = new (...args: any[]) => T
    type Positionable = GConstructor<{ setPos: (x: number, y: number) => void }>;

    // type Spritable = GConstructor<typeof Sprite>;
    // type Loggable = GConstructor<{ print: () => void }>;

    class Sprite {
        name = "";
        x = 0;
        y = 0;

        constructor(name: string) {
            this.name = name;
        }
    }

    // @ts-ignore
    const Jumpable = <TBase extends Positionable>(Base: TBase) => {
        return class Jumpable extends Base {
            jump() {
                // This mixin will only work if it is passed a base
                // class which has setPos defined because of the
                // Positionable constraint.
                this.setPos(0, 20);
            }
        };
    }

    describe("Test type-based mixin utils", () => {
        test('it should be a valid type-based property',
            async () => {
                // Compose a new class from the Sprite class,
                // with the Mixin Scale applier:
                const EightBitSprite = Scale(Sprite);

                const flappySprite = new EightBitSprite("Bird");
                flappySprite.setScale(0.8);
                console.log(flappySprite.scale);
            }
        )
    })
}

export namespace Mixins_Test2 {
    // Each mixin is a traditional ES class
    class Jumpable {
        jump() {
        }
    }

    class Duckable {
        duck() {
        }
    }

    // Including the base
    class Sprite {
        x = 0;
        y = 0;
    }

    // Then you create an interface which merges
    // the expected mixins with the same name as your base
    interface Sprite extends Jumpable, Duckable {
    }

    // Apply the mixins into the base class via
    // the JS at runtime
    applyMixins(Sprite, [Jumpable, Duckable]);

    // This can live anywhere in your codebase:
    function applyMixins(derivedCtor: any, constructors: any[]) {
        constructors.forEach((baseCtor) => {
            Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
                Object.defineProperty(
                    derivedCtor.prototype,
                    name,
                    Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
                    Object.create(null)
                );
            });
        });
    }

    describe("Test class-based mixin utils", () => {
        test('it should be a valid class-based property',
            async () => {
                let player = new Sprite();
                player.jump();
                console.log(player.x, player.y);
            }
        )
    })
}

export namespace Mixin_Tests3 {
    // A decorator function which replicates the mixin pattern:
    const Pausable = (target: typeof Player) => {
        return class Pausable extends target {
            shouldFreeze = false;
        };
    };

    @Pausable
    class Player {
        x = 0;
        y = 0;
    }

    describe("Test decorator-based mixin utils", () => {
        test('it should be a valid decorator-based property',
            async () => {
                // It the runtime aspect could be manually replicated via
                // type composition or interface merging.
                type FreezablePlayer = Player & { shouldFreeze: boolean };
                const playerTwo = (new Player() as unknown) as FreezablePlayer;

                console.log(playerTwo.shouldFreeze)
            }
        )
    })
}

export namespace MixinTests4 {
    function base<T>() {
        class Base {
            static prop: T;
        }

        return Base;
    }

    function derived<T>() {
        class Derived extends base<T>() {
            static anotherProp: T;
        }

        return Derived;
    }

    class Spec extends derived<string>() {
    }

    describe("Test function-based mixin utils", () => {
        test('it should be a valid function-based property',
            async () => {
                Spec.prop = 'test property'
                Spec.anotherProp = 'test another property'

                console.log(Spec.prop)
                console.log(Spec.anotherProp)
            }
        )
    })
}
