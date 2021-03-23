import { Checkers } from '../src'
import isFunction = Checkers.isFunction
import isArray = Checkers.isArray

export type EventHandler<T> = (event: T) => void

export const eventSource = ((globals): void => {
    const events = {}

    /**
     * Add an event handler to be triggered only once (or a given number of times)
     * for a given event.
     * @function
     * @param {String} eventName - Name of event to register.
     * @param {EventHandler} handler - Function to call when event
     * is triggered.
     * @param {Object} [userData=null] - Arbitrary object to be passed unchanged
     * to the handler.
     * @param {Number} [times=1] - The number of times to handle the event
     * before removing it.
     */
    globals['addOnceHandler'] = <T>(
        eventName: string,
        handler: EventHandler<T>,
        userData: any,
        times: number,
    ): void => {
        times = times || 1
        let count = 0

        const onceHandler = (event: any): void => {
            count++
            if (count === times) {
                globals['removeHandler'](eventName, onceHandler)
            }
            handler(event)
        }

        globals['addHandler'](eventName, onceHandler, userData)
    }

    /**
     * Add an event handler for a given event.
     * @function
     * @param {String} eventName - Name of event to register.
     * @param {EventHandler} handler - Function to call when event is triggered.
     * @param {Object} [userData=null] - Arbitrary object to be passed unchanged to the handler.
     */
    globals['addHandler'] = <T>(eventName: string, handler: EventHandler<T>, userData: any): void => {
        let events_ = events[eventName]
        if (!events_) {
            events_[eventName] = events_ = []
        }

        if (handler && isFunction(handler)) {
            events_[events_.length] = { handler, userData: userData || null }
        }
    }

    /**
     * Remove a specific event handler for a given event.
     * @function
     * @param {String} eventName - Name of event for which the handler is to be removed.
     * @param {EventHandler} handler - Function to be removed.
     */
    globals['removeHandler'] = <T>(eventName: string, handler: EventHandler<T>): void => {
        const handlers: T[] = []

        const events_ = events[eventName]
        if (!events_) {
            return
        }

        if (isArray(events_)) {
            for (const item of events_) {
                if (item.handler !== handler) {
                    handlers.push(item)
                }
            }

            events_[eventName] = handlers
        }
    }

    /**
     * Remove all event handlers for a given event type. If no type is given all
     * event handlers for every event type are removed.
     * @function
     * @param {String} eventName - Name of event for which all handlers are to be removed.
     */
    globals['removeAllHandlers'] = (eventName: string): void => {
        if (eventName) {
            events[eventName] = []
        } else {
            for (const eventType in events) {
                events[eventType] = []
            }
        }
    }

    /**
     * Get a function which iterates the list of all handlers registered for a given event, calling the handler for each.
     * @function
     * @param {String} eventName - Name of event to get handlers for.
     */
    globals['getHandler'] = (eventName: string): any => {
        let events_ = events[eventName]
        if (!events_ || !events_.length) {
            return null
        }

        events_ = events_.length === 1 ? [events_[0]] : [...events_]

        return (source, args) => {
            const length = events_.length
            for (let i = 0; i < length; i++) {
                if (events_[i]) {
                    args.eventSource = source
                    args.userData = events_[i].userData
                    events_[i].handler(args)
                }
            }
        }
    }

    /**
     * Trigger an event, optionally passing additional information.
     * @function
     * @param {String} eventName - Name of event to register.
     * @param {Object} eventArgs - Event-specific data.
     */
    globals['raiseEvent'] = (eventName: string, eventArgs: any): void => {
        //uncomment if you want to get a log of all events
        //$.console.log( eventName );
        const handler = globals['getHandler'](eventName)

        if (handler) {
            if (!eventArgs) {
                eventArgs = {}
            }

            handler(this, eventArgs)
        }
    }
})(window || {})
