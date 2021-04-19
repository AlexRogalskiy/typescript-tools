export default class Observer {
    static createSubObserver(): Observer {
        return new Observer(Symbol('sub'))
    }

    static createPubObserver(): Observer {
        return new Observer(Symbol('pub'))
    }

    constructor(private readonly property: PropertyKey) {
        this[this.property] = []
    }

    observe(subject, handler, target = this): void {
        const sub = subject.subscribe(handler.bind(target))
        this[this.property].push(sub)
    }

    dispose(): void {
        for (const sub of this[this.property]) {
            if (typeof sub.dispose === 'function') {
                sub.dispose()

                // Added to support rxjs subscription disposals.
            } else if (typeof sub.unsubscribe === 'function') {
                sub.unsubscribe()
            }
        }
    }
}
