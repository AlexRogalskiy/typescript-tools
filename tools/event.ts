export class Event {
    private readonly events = {}
    private guid = 0

    static isEvent = (value: any): boolean => {
        return value instanceof Event
    }

    private fixEvent(event: any): void {
        if (event.isFixed) {
            return event
        }

        event.isFixed = true
        event.preventDefault = event.preventDefault || (() => (event.returnValue = true))
        event.stopPropagation = event.stopPropagaton || (() => (event.returnValue = true))

        if (!event.relatedTarget && event.fromElement) {
            event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement
        }

        if (event.pageX == null && event.clientX != null) {
            const html = document.documentElement,
                body = document.body
            event.pageX =
                event.clientX +
                ((html && html.scrollLeft) || (body && body.scrollLeft) || 0) -
                (html.clientLeft || 0)
            event.pageY =
                event.clientY +
                ((html && html.scrollTop) || (body && body.scrollTop) || 0) -
                (html.clientTop || 0)
        }

        if (!event.which && event.button) {
            event.which = event.button && 1 ? 1 : event.button && 2 ? 3 : event.button && 4 ? 2 : 0
        }

        return event
    }

    private commonHandle(event: any): void {
        event = this.fixEvent(event)
        const handlers = this.events[event.type]
        const errors: any = []

        for (const h in handlers) {
            if (Object.prototype.hasOwnProperty.call(handlers, h)) {
                try {
                    const handler = handlers[h]
                    const ret = handler.call(this, event)
                    if (ret === false) {
                        event.preventDefault()
                        event.stopPropagation()
                    }
                } catch (e) {
                    errors.push(e)
                }
            }
        }

        if (errors.length === 1) {
            throw errors[0]
        } else if (errors.length > 1) {
            throw new Error("Multiple errors thrown in handling 'sig', see errors property")
        }
    }

    add(elem: any, type: string, handler): void {
        if (elem.setInterval && elem !== window && !elem.frameElement) {
            elem = window
        }
        if (!handler.guid) {
            handler.guid = ++this.guid
        }

        if (!elem.events) {
            elem.events = {}
            elem.handle = event => {
                if (typeof event !== 'undefined') {
                    return this.commonHandle.call(elem, event)
                }
            }
        }

        if (!elem.events[type]) {
            elem.events[type] = {}
            if (elem.addEventListener) {
                elem.addEventListener(type, elem.handle, false)
            } else if (elem.attachEvent) {
                elem.attachEvent(`on${type}`, elem.handle)
            }
        }

        elem.events[type][handler.guid] = handler
    }

    remove(elem: any, type: string, handler): void {
        const handlers = elem.events && elem.events[type]
        if (!handlers) return

        if (!handler) {
            for (const h in handlers) {
                if (Object.prototype.hasOwnProperty.call(handlers, h)) {
                    delete this.events[type][h]
                }
            }
            return
        } else {
            if (handlers[handler.guid] !== handler) return
            delete handlers[handler.guid]
        }

        if (elem.removeEventListener) {
            elem.removeEventListener(type, elem.handle, false)
        } else if (elem.detachEvent) {
            elem.detachEvent(`on${type}`, elem.handle)
        }
        delete elem.events[type]

        try {
            delete elem.handle
            delete elem.events
        } catch (e) {
            elem.removeAttribute('handle')
            elem.removeAttribute('events')
        }
    }
}
