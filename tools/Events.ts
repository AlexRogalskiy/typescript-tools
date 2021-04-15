export class Events {
    private readonly events: any

    constructor() {
        this.events = {}
    }

    on(eventName: string, callback: any): void {
        if (this.events[eventName]) {
            this.events[eventName].push(callback)
        } else {
            this.events[eventName] = [callback]
        }
    }

    emit(eventName: string, ...args: any): void {
        if (this.events[eventName]) {
            for (const cb of this.events[eventName]) {
                cb(...args)
            }
        }
    }
}
