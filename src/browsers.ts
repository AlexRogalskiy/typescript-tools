import { Checkers } from './checkers'
import { Errors } from './errors'
import { DomElement } from '../typings/standard-types'
import { Commons } from './commons'

export namespace Browsers {
    import isDomElement = Checkers.isDomElement
    import isString = Checkers.isString
    import valueError = Errors.valueError
    import isNull = Checkers.isNull
    import toBoolean = Commons.toBoolean
    import isNumber = Checkers.isNumber

    /**
     * let supportsSlider = supportsInputOfType('range');
     * let supportsColorpicker = supportsInputOfType('color');
     * @param type
     */
    export const supportsInputOfType = (type: string): boolean => {
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
            const regex = new RegExp(`(&${param}=)[^&]+`)
            location.assign(location.href.replace(regex, `$1${value}`))
        }
    }

    export const getElementsByClass = <T extends DomElement>(searchClass: string, node, tag: string): T[] => {
        const classElements: T[] = []

        const nodeValue = node == null ? document : isDomElement(node) ? node : null
        if (isNull(nodeValue)) {
            throw valueError(`incorrect node value: < ${nodeValue} >`)
        }

        const tagValue = tag == null ? '*' : isString(tag) ? tag : null
        if (isNull(tagValue)) {
            throw valueError(`incorrect tag value: < ${tagValue} >`)
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

    export const byId = <T extends DomElement>(elem: any): T | null => {
        return isString(elem) ? document.getElementById(elem) : isDomElement(elem) ? elem : null
    }

    /**
     * Creates specified element with specified attributes
     * @param {String} name Type of an element to create
     * @param {Object} [attrs] Attributes to set on an element
     * @return {HTMLElement} Newly created element
     */
    export const makeElement = (name: string, ...attrs: any[]): HTMLElement => {
        const elem = document.createElement(name)
        // eslint-disable-next-line @typescript-eslint/no-for-in-array
        for (const prop in attrs) {
            if (prop === 'class') {
                elem.className = attrs[prop]
            } else if (prop === 'id') {
                elem.id = attrs[prop]
            } else {
                elem.setAttribute(prop, attrs[prop])
            }
        }

        return elem
    }

    /**
     * Wraps element with another element
     * @param {HTMLElement} element Element to wrap
     * @param {HTMLElement|String} wrapper Element to wrap with
     * @param {Object} [attributes] Attributes to set on a wrapper
     * @return {HTMLElement} wrapper
     */
    export const wrapElement = <T extends DomElement>(
        element: T,
        wrapper: any,
        ...attributes: any[]
    ): void => {
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

    export const getElemText = <T extends HTMLElement>(elem: T): string => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }
        const getElemText_ = elem.innerText !== undefined ? elem => elem.innerText : elem => elem.textContent

        return getElemText_(elem)
    }

    export const getBodyScrollTop = (): number => {
        return (
            (document.documentElement && document.documentElement.scrollTop) ||
            (document.body && document.body.scrollTop)
        )
    }

    export const sortUnorderedList = (id: any, sortDescending = false): void => {
        if (isString(id)) {
            id = document.getElementById(id)
        }
        // Получаем ячейки списка в массив
        const list = id.getElementsByTagName('li')
        const values: string[] = []
        for (let i = 0, l = list.length; i < l; i++) {
            values.push(list[i].innerHTML)
        }
        // Сортируем их
        // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
        values.sort()
        // Если в обрятном порядке, то оборачиваем
        if (sortDescending) {
            values.reverse()
        }
        // Меняем содержимое элементов списка
        for (let i = 0, l = list.length; i < l; i++) {
            list[i].innerHTML = values[i]
        }
    }

    export const replaceURLWithHTMLLinks = (text: string): string => {
        const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi

        return text.replace(exp, "<a href='$1'>$1</a>")
    }

    export const firstAncestor = <T extends Element>(elem: T, tagName: string): T => {
        if (!isDomElement(elem) || !isString(tagName)) {
            throw valueError(`incorrect input values: DOMElement < ${elem} >, tag name < ${tagName} >`)
        }

        let el: (Node & ParentNode) | null = elem
        while (el != null && el.nodeName !== tagName.toUpperCase()) {
            el = el.parentNode
        }

        return elem
    }

    export const toogle = <T extends HTMLElement>(elem: T): void => {
        const displayCache = {}

        const isHidden = <T extends HTMLElement>(el: T): boolean => {
            const width = el.offsetWidth
            const height = el.offsetHeight
            const tr = el.nodeName.toLowerCase() === 'tr'

            const isVisible = width > 0 && height > 0 && !tr ? false : toBoolean(getRealDisplay(el))

            return width === 0 && height === 0 && !tr ? true : isVisible
        }

        const show = <T extends HTMLElement>(el: T): void => {
            if (getRealDisplay(el) !== 'none') return
            const old = el.getAttribute('displayOld')
            el.style.display = old || ''

            if (getRealDisplay(el) === 'none') {
                const nodeName = el.nodeName
                const body = document.body
                let display

                if (displayCache[nodeName]) {
                    display = displayCache[nodeName]
                } else {
                    const testElem = document.createElement(nodeName)
                    body.appendChild(testElem)
                    display = getRealDisplay(testElem)

                    if (display === 'none') {
                        display = 'block'
                    }

                    body.removeChild(testElem)
                    displayCache[nodeName] = display
                }

                el.setAttribute('displayOld', display)
                el.style.display = display
            }
        }

        const hide = <T extends HTMLElement>(elem: T): void => {
            if (!elem.getAttribute('displayOld')) {
                elem.setAttribute('displayOld', elem.style.display)
            }
            elem.style.display = 'none'
        }

        const getRealDisplay = <T extends HTMLElement>(elem: T): string | null => {
            if (elem.style) {
                return elem.style.display
            } else if (window.getComputedStyle) {
                const computedStyle = window.getComputedStyle(elem, null)
                return computedStyle.getPropertyValue('display')
            }

            return null
        }

        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        isHidden(elem) ? show(elem) : hide(elem)
    }

    export const testKey = <T extends KeyboardEvent>(e: T): boolean => {
        // Make sure to use event.charCode if available
        const key = typeof e.code === 'undefined' ? e.key : e.code
        const keyCode = parseInt(key)
        // Ignore special keys
        if (e.ctrlKey || e.altKey || keyCode < 32) {
            return true
        }

        return /\w/.test(String.fromCharCode(keyCode)) /*/[\d\.]/*/
    }

    export const elem2span = <T extends HTMLElement>(elem: T): void => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        const span = document.createElement('span')
        while (elem.firstChild) span.appendChild(elem.firstChild)
        elem.parentNode && elem.parentNode.replaceChild(span, elem)
    }

    export const getElementsByAttribute = <T extends Node>(elem: T, att: string, value: any): T[] => {
        if (!isDomElement(elem) || !isString(att)) {
            throw valueError(`incorrect input parameters: DOMElement < ${elem} >, attribute < ${att} >`)
        }

        const res: T[] = []

        const walkDom = (node: any, func): void => {
            func(node)
            node = node?.firstChild

            while (node) {
                walkDom(node, func)
                node = node.nextSibling
            }
        }

        walkDom(elem, node => {
            const actual = node.nodeType === 1 && node.getAttribute(att)
            if (isString(actual) && (actual === value || !isString(value))) {
                res.push(node)
            }
        })

        return res
    }

    export const fade = <T extends HTMLElement>(elem: T, period: number): void => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        const per = period == null ? 100 : isNumber(period) && period > 0 ? period : null
        if (per == null) {
            throw valueError(`incorrect period value: < ${per} >`)
        }

        let level = 1
        const step = (): void => {
            const hex = level.toString(16)
            elem.style.backgroundColor = `#FFFF${hex}${hex}`
            if (level < 15) {
                level += 1
                setTimeout(step, per)
            }
        }

        setTimeout(step, per)
    }

    export const eventuality = (that: any): void => {
        const registry = {}

        that.trigger = (event: any): any => {
            const type = isString(event) ? event : event.type

            let array, func, handler
            if (Object.prototype.hasOwnProperty.call(registry, type)) {
                array = registry[type]
                for (const item of array) {
                    handler = item
                    func = handler.method
                    if (typeof func === 'string') {
                        func = that[func]
                    }
                    func.apply(that, handler.parameters || [event])
                }
            }

            return that
        }

        that.bind = (type: string, method, parameters): any => {
            const handler = {
                method,
                parameters,
            }

            if (Object.prototype.hasOwnProperty.call(registry, type)) {
                registry[type].push(handler)
            } else {
                registry[type] = [handler]
            }
            return that
        }

        return that
    }

    export const cleanNode = <T extends Element>(elem: T): void => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        while (elem.firstChild) {
            elem.removeChild(elem.firstChild)
        }
    }

    export const getOffset = <T extends Element>(elem: T): { top; left } => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        const getOffsetSum = (elem): { top; left } => {
            let top = 0,
                left = 0

            while (elem) {
                top += parseInt(elem.offsetTop)
                left += parseInt(elem.offsetLeft)
                elem = elem.offsetParent
            }

            return { top, left }
        }

        const getOffsetRect = <T extends Element>(elem: T): { top; left } => {
            // (1)
            const box = elem.getBoundingClientRect()
            // (2)
            const body = document.body
            const docElem = document.documentElement
            // (3)
            const scrollTop = window.pageYOffset || docElem.scrollTop || body.scrollTop
            const scrollLeft = window.pageXOffset || docElem.scrollLeft || body.scrollLeft
            // (4)
            const clientTop = docElem.clientTop || body.clientTop || 0
            const clientLeft = docElem.clientLeft || body.clientLeft || 0
            // (5)
            const top = box.top + scrollTop - clientTop
            const left = box.left + scrollLeft - clientLeft

            return { top: Math.round(top), left: Math.round(left) }
        }

        return elem.getBoundingClientRect !== undefined ? getOffsetRect(elem) : getOffsetSum(elem)
    }

    export const getElementBounds = <T extends HTMLElement>(
        elem: T,
    ): { left: number; top: number; width: number; height: number } => {
        if (!isDomElement(elem)) {
            throw valueError(`incorrect DOMElement: < ${elem} >`)
        }

        let left = elem.offsetLeft
        let top = elem.offsetTop
        for (
            let parent: Element | null | undefined = elem.offsetParent;
            parent && parent.parentElement;
            parent = parent.parentElement.offsetParent
        ) {
            left += parent.parentElement.offsetLeft - parent.scrollLeft
            top += parent.parentElement.offsetTop - parent.scrollTop
        }

        return { left, top, width: elem.offsetWidth, height: elem.offsetHeight }
    }

    export const getElements = (...args: any[]): any => {
        const elements = {}
        for (const id of args) {
            const elt = document.getElementById(id)
            if (elt == null) {
                throw new Error(`Cannot find element with id=${id}`)
            }
            elements[id] = elt
        }

        return elements
    }

    // Возвращает неформатированное текстовое
    // содержимое элемента е, рекурсивно проходя no
    // дочерним элементам. Эта функция работает
    // аналогично свойству textContent
    export const textContent = <T extends Node>(elem: T): string => {
        let type,
            s = ''
        for (let c = elem.firstChild; c != null; c = c.nextSibling) {
            type = c.nodeType
            if (type === 3) s += c.nodeValue
            else if (type === 1) {
                s += textContent(c)
            }
        }

        return s
    }

    // Вставка дочернего узла в позицию n
    export const insertAt = <T extends Node>(parent: T, child: T, num: number): void => {
        if (num < 0 || num > parent.childNodes.length) {
            throw valueError(`invalid node value=${num}`)
        } else if (num === parent.childNodes.length) {
            parent.appendChild(child)
        } else {
            parent.insertBefore(child, parent.childNodes[num])
        }
    }

    export const rowHeights = (rows: CSSStyleDeclaration[][]): number[] => {
        return rows.map(row => {
            return row.reduce((max, cell) => {
                return Math.max(max, parseInt(cell.minHeight))
            }, 0)
        })
    }

    export const colWidths = (rows: CSSStyleDeclaration[][]): number[] => {
        return rows[0].map((_, i) => {
            return rows.reduce((max, row) => {
                return Math.max(max, parseInt(row[i].minWidth))
            }, 0)
        })
    }

    export const drawTable = (rows: CSSStyleDeclaration[][]): string => {
        const heights = rowHeights(rows)
        const widths = colWidths(rows)

        const drawLine = (blocks: CSSStyleDeclaration[], lineNo: number): string => {
            return blocks.map(block => block[lineNo]).join('	')
        }

        const drawRow = (row, rowNum: number): string => {
            const blocks = row.map((cell, colNum) => {
                return cell.draw(widths[colNum], heights[rowNum])
            })

            return blocks[0].map((_, lineNo) => drawLine(blocks, lineNo)).join('\n')
        }

        return rows.map(drawRow).join('\n')
    }

    export const hasPlugin = (name: string): boolean => {
        name = name.toLowerCase()
        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let i = 0; i < navigator.plugins.length; i++) {
            if (navigator.plugins[i].name.toLowerCase().includes(name)) {
                return true
            }
        }
        return false
    }
}
