import { Mixins } from '../src/mixins'

export namespace MixinsTest {
    import Scale = Mixins.Scale;

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

    // Compose a new class from the Sprite class,
    // with the Mixin Scale applier:
    const EightBitSprite = Scale(Sprite);

    const flappySprite = new EightBitSprite("Bird");
    flappySprite.setScale(0.8);
    console.log(flappySprite.scale);

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
}

export namespace MixinsTest2 {
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

    let player = new Sprite();
    player.jump();
    console.log(player.x, player.y);

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
}

export namespace MixinTests3 {
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

    // It the runtime aspect could be manually replicated via
    // type composition or interface merging.
    type FreezablePlayer = Player & { shouldFreeze: boolean };
    const playerTwo = (new Player() as unknown) as FreezablePlayer;
    playerTwo.shouldFreeze;
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

    Spec.prop; // string
    Spec.anotherProp; // string
}
