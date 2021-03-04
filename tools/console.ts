import { keywords } from './keywords'

export const setup = ((globals, property) => {
    const properties = ['memory']
    const dummy = (): void => {
        // empty
    }

    let prop, method
    const con = globals[property]

    while ((prop = properties.pop())) {
        if (!con[prop]) {
            con[prop] = {}
        }
    }
    while ((method = keywords.pop())) {
        if (!con[method]) {
            con[method] = dummy
        }
    }
})(window, 'console')

export const cleanup = ((globals, property) => {
    const con = globals[property]
    for (const key of keywords) {
        delete con[key]
    }
})(window, 'console')
