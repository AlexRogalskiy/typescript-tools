import { Checkers } from './checkers'
import { Exceptions } from './exceptions'
import { DomElement } from '../typings/standard-types'

export namespace Browsers {
    import isDomElement = Checkers.isDomElement
    import isString = Checkers.isString
    import valueException = Exceptions.valueException

    /**
     * let supportsSlider = supportsInputOfType('range');
     * let supportsColorpicker = supportsInputOfType('color');
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
        if (nodeValue == null) {
            throw valueException(`incorrect node value: < ${nodeValue} >`)
        }

        const tagValue = tag == null ? '*' : isString(tag) ? tag : null
        if (tagValue == null) {
            throw valueException(`incorrect tag value: < ${tagValue} >`)
        }

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

    export const byId = (node: any): DomElement | null => {
        return isString(node) ? document.getElementById(node) : isDomElement(node) ? node : null
    }

    /**
     * Creates specified element with specified attributes
     * @param {String} tagName Type of an element to create
     * @param {Object} [attributes] Attributes to set on an element
     * @return {HTMLElement} Newly created element
     */
    export const makeElement = (tagName: string, ...attributes: any[]): DomElement => {
        const el = document.createElement(tagName)
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const prop in attributes) {
            if (prop === 'class') {
                el.className = attributes[prop]
            } else if (prop === 'id') {
                el.id = attributes[prop]
            } else {
                el.setAttribute(prop, attributes[prop])
            }
        }

        return el
    }

    /**
     * Wraps element with another element
     * @param {HTMLElement} element Element to wrap
     * @param {HTMLElement|String} wrapper Element to wrap with
     * @param {Object} [attributes] Attributes to set on a wrapper
     * @return {HTMLElement} wrapper
     */
    export const wrapElement = (element: DomElement, wrapper: any, ...attributes: any[]): void => {
        if (typeof wrapper === 'string') {
            wrapper = makeElement(wrapper, attributes)
        }

        if (element.parentNode) {
            element.parentNode.replaceChild(wrapper, element)
        }
        wrapper.appendChild(element)

        return wrapper
    }

    export const createDiv = (html: string): DomElement => {
        const div = document.createElement('div')
        div.innerHTML = html
        return div
    }
}
