import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { DomElement } from '../typings/standard-types'

export namespace Browsers {
    import isDomElement = Checkers.isDomElement
    import isString = Checkers.isString
    import exception = Exceptions.exception
    /**
     * var supportsSlider = supportsInputOfType('range');
     * var supportsColorpicker = supportsInputOfType('color');
     * @param type
     */
    export const supportsInputOfType = (type: any): boolean => {
        const el = document.createElement('input')
        try {
            el.type = type
        } catch (err) {
            console.error(err.stack)
        }
        return el.type === type
    }

    export const supportsNativeJSON = (): boolean => {
        return typeof JSON !== 'undefined' && Object.prototype.toString.call(JSON) === '[object JSON]'
    }

    export const changeParamValue = (param: string, value: any): void => {
        const location = new Location()
        if (!location.href.includes(`&${param}`)) {
            location.assign(`${location.href}&${param}=${value}`)
        } else {
            const regex = new RegExp(`(&${param}=)[^&]+`) //(&page=)[^\&]+/
            location.assign(location.href.replace(regex, `$1${value}`))
        }
    }

    export const getElementsByClass = (searchClass: string, node, tag: string): DomElement[] => {
        const classElements: DomElement[] = []

        const nodeValue = node == null ? document : isDomElement(node) ? node : null
        if (nodeValue == null) throw exception('ValueError', `incorrect node value: < ${nodeValue} >`)

        const tagValue = tag == null ? '*' : isString(tag) ? tag : null
        if (tagValue == null) throw exception('ValueError', `incorrect tag value: < ${tagValue} >`)

        const els = nodeValue.getElementsByTagName(tagValue)
        const regexp = `(^|\\s)${searchClass}(\\s|$)`
        const pattern = new RegExp(regexp)

        for (const item of els) {
            if (pattern.test(item.className)) {
                classElements.push(item)
            }
        }

        return classElements
    }
}
