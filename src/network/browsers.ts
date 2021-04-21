import 'jsdom-global/register'

import { DomElement, Optional } from '../../typings/standard-types'
import { Keys } from '../../typings/general-types'

import { URL_REGEX4, Checkers, Errors, Strings, CommonUtils, ColorsUtils, Formats } from '..'

export namespace Browsers {
    import isDomElement = Checkers.isDomElement
    import isString = Checkers.isString
    import isNull = Checkers.isNull
    import isNumber = Checkers.isNumber
    import isNotNull = Checkers.isNotNull
    import isFunction = Checkers.isFunction

    import valueError = Errors.valueError

    import capitalFirstLetter = Strings.capitalFirstLetter

    import defineStaticProperty = CommonUtils.defineStaticProperty
    import defineProperty = CommonUtils.defineProperty

    import isColorBright = ColorsUtils.isColorBright

    const { hasOwnProperty: hasOwnProp } = Object.prototype

    export interface StyledProps {
        theme: any
    }

    export interface TagStyleProps {
        color: string
    }

    export const validate = (evt: any): void => {
        const theEvent = evt || window['event']
        let key = theEvent.keyCode || theEvent.which
        key = String.fromCharCode(key)
        const regex = /[0-9]|\./
        if (!regex.test(key)) {
            theEvent.returnValue = false
        }
    }

    export const storeLocation = (position): { latitude: number; longitude: number } => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        return {
            latitude,
            longitude,
        }
    }

    export const errorHandler = (err: any): void => {
        if (err.code === 1) {
            console.error('Error: Location Access Denied!')
        } else if (err.code === 2) {
            console.error('Error: Location is Unavailable!')
        }
    }

    export const getLocation = (): void => {
        if (navigator.geolocation) {
            const options = {
                timeout: 60000,
            }
            navigator.geolocation.getCurrentPosition(storeLocation, errorHandler, options)
        } else {
            throw valueError('Sorry, your browser does not support geolocation!')
        }
    }

    export type OsNameOptions = 'windows' | 'macos' | 'unix' | 'linux' | 'unknown'

    export const borderColor = ({ theme }: StyledProps): string => `border-color: ${theme.borderColor};`

    export const border = ({ theme }: StyledProps): string => `border: 1px solid ${theme.borderColor};`

    export const borderBottom = ({ theme }: StyledProps): string =>
        `border-bottom: 1px solid ${theme.borderColor};`

    export const borderTop = ({ theme }: StyledProps): string => `border-top: 1px solid ${theme.borderColor};`

    export const borderLeft = ({ theme }: StyledProps): string =>
        `border-left: 1px solid ${theme.borderColor};`

    export const borderRight = ({ theme }: StyledProps): string =>
        `border-right: 1px solid ${theme.borderColor};`

    export const noteListIconColor = ({ theme }: StyledProps): string => `
                color: ${theme.noteListIconColor};
                transition: 200ms color;
                &:hover,
                &:active,
                &:focus {
                  color: ${theme.noteListActiveIconColor};
                }
           `

    export const noteDetailIconColor = ({ theme }: StyledProps): string => `
                color: ${theme.noteDetailIconColor};
                transition: 200ms color;
                &:hover,
                &:active,
                &:focus {
                  color: ${theme.noteDetailActiveIconColor};
                }
            `

    export const closeIconColor = ({ theme }: StyledProps): string => `
                color: ${theme.closeIconColor};
                transition: 200ms color;
                &:hover,
                &:active,
                &:focus {
                  color: ${theme.closeActiveIconColor};
                }
            `

    export const inputStyle = ({ theme }: StyledProps): string =>
        `   background-color: ${theme.inputBackground};
            border: 1px solid ${theme.borderColor};
            border-radius: 2px;
            color: ${theme.textColor};
            &:focus {
              box-shadow: 0 0 0 2px ${theme.primaryColor};
            }
            &::placeholder {
              color: ${theme.uiTextColor};
            }
        `

    export const tagBackgroundColor = ({ theme, color }: StyledProps & TagStyleProps): string => {
        const value = isColorBright(color || theme.secondaryBackgroundColor) ? 85 : 115

        return `
                background-color: ${color || theme.secondaryBackgroundColor};
                    &:hover {
                        filter: brightness(${value}%);
                        background-color: ${color || theme.secondaryBackgroundColor};
                    }
                }
            `
    }

    export const textOverflow = (): string =>
        `
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        `

    export const flexCenter = (): string =>
        `
            display: flex;
            align-items: center;
            justify-content: center;
        `

    export const contextMenuShadow = ({ theme }: StyledProps): string => `box-shadow: ${theme.shadow};`

    export const $ = <K extends Keys<HTMLElementTagNameMap>>(
        selector: K,
        doc: Document = document,
    ): Optional<HTMLElementTagNameMap[K]> => doc.querySelector(selector)

    export const $$ = <K extends Keys<HTMLElementTagNameMap>>(
        selector: K,
        doc: Document = document,
    ): NodeListOf<HTMLElementTagNameMap[K]> => doc.querySelectorAll(selector)

    export const init = (() => {
        const _matchesStaticSymbol = '__matches__'
        const _matchesSymbol = 'matches'

        const matches_ = <K extends Keys<HTMLElementTagNameMap>>(obj: any, selector: K): boolean => {
            const matches = $$(selector, obj.document || obj.ownerDocument)
            let i = matches.length
            while (--i >= 0 && matches.item(i) !== obj) {
                // empty
            }

            return i > -1
        }

        if (!isFunction(Element.prototype[_matchesSymbol])) {
            Element.prototype[_matchesSymbol] =
                Element.prototype['matchesSelector'] ||
                Element.prototype['mozMatchesSelector'] ||
                Element.prototype['msMatchesSelector'] ||
                Element.prototype['oMatchesSelector'] ||
                Element.prototype['webkitMatchesSelector'] ||
                defineProperty(Element.prototype, _matchesSymbol, {
                    value(obj) {
                        return matches_(this, obj)
                    },
                })
        }

        if (!isFunction(Element[_matchesStaticSymbol])) {
            defineStaticProperty(Element, _matchesStaticSymbol, {
                value: (obj1, obj2) => matches_(obj1, obj2),
            })
        }
    })()

    export const clearAllChildren = (elem: Node): void => {
        while (elem.firstChild) {
            elem.removeChild(elem.firstChild)
        }
    }

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

    export const byId = <T extends DomElement>(elem: any): Optional<T> => {
        return isString(elem) ? document.getElementById(elem) : isDomElement(elem) ? elem : null
    }

    /**
     * Returns the property with the correct vendor prefix appended.
     * @param {String} property the property name
     * @returns {String} the property with the correct prefix or null if not
     * supported.
     */
    export const getCssPropertyWithVendorPrefix = (property: string): string => {
        const memo = {}

        const getCssPropertyWithVendorPrefix_ = (property: string): string => {
            if (memo[property] !== undefined) {
                return memo[property]
            }

            const style = document.createElement('div').style

            let result = ''
            if (style[property] !== undefined) {
                result = property
            } else {
                const prefixes = ['Webkit', 'Moz', 'MS', 'O', 'webkit', 'moz', 'ms', 'o']
                const suffix = capitalFirstLetter(property)
                for (const item of prefixes) {
                    const prop = item + suffix
                    if (style[prop] !== undefined) {
                        result = prop
                        break
                    }
                }
            }
            memo[property] = result
            return result
        }

        return getCssPropertyWithVendorPrefix_(property)
    }

    /**
     * Gets the position of the mouse on the screen for a given event.
     * @function
     * @param {Event} [event]
     */
    export const getMousePosition = (event): { x: number; y: number } => {
        let getMousePosition_
        if (typeof event.pageX === 'number') {
            getMousePosition_ = (event): any => {
                return {
                    x: event.pageX,
                    y: event.pageY,
                }
            }
        } else if (typeof event.clientX === 'number') {
            getMousePosition_ = (event): any => {
                return {
                    x: event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft,
                    y: event.clientY + document.body.scrollTop + document.documentElement.scrollTop,
                }
            }
        } else {
            throw new Error('Unknown event mouse position, no known technique.')
        }

        return getMousePosition_(event)
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

    export const replaceUrlWithHtmlLinks = (text: string, title = '$1'): string => {
        const exp = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\\/%?=~_|!:,.;]*[-A-Z0-9+&@#\\/%=~_|])/gi

        return text.replace(exp, `<a href='$1'>${title}</a>`)
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

    export const toggle = <T extends HTMLElement>(elem: T): void => {
        const displayCache = {}

        const isHidden = <T extends HTMLElement>(el: T): boolean => {
            const width = el.offsetWidth
            const height = el.offsetHeight
            const tr = el.nodeName.toLowerCase() === 'tr'

            const isVisible = width > 0 && height > 0 && !tr ? false : Formats.toBoolean(getRealDisplay(el))

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

        const getRealDisplay = <T extends HTMLElement>(elem: T): Optional<string> => {
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
            node = node && node.firstChild

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
            if (hasOwnProp.call(registry, type)) {
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

            if (hasOwnProp.call(registry, type)) {
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

    export const tag = (name: string, elem: Element): any => {
        return (elem || document).getElementsByTagName(name)
    }

    export const addClass = (obj: any, clazz: string): void => {
        if (!hasClass(obj, clazz)) {
            obj.className += ` ${clazz}`
        }
    }

    export const removeClass = (obj: any, clazz: string): void => {
        if (hasClass(obj, clazz)) {
            obj.className = obj.className
                .replace(new RegExp(`(\\s|^)${clazz}(\\s|$)`), ' ')
                .replace(/\s+/g, ' ')
                .replace(/^\s|\s$/, '')
        }
    }

    /**
     * Remove the specified CSS class from the element.
     * @function
     * @param elementId element id
     * @param {String} className
     */
    export const removeClass2 = (elementId: string, className: string): void => {
        const newClasses: string[] = []
        const element = byId(elementId)

        if (!element) {
            throw valueError(`Element not found by id: ${elementId}`)
        }

        const oldClasses = element['className'].split(/\s+/)

        for (const item of oldClasses) {
            if (item && item !== className) {
                newClasses.push(item)
            }
        }

        element['className'] = newClasses.join(' ')
    }

    export const findById = (() => {
        const cache = {}

        return (id: string): Optional<HTMLElement> => {
            if (cache[id] === undefined) {
                cache[id] = document.getElementById(id) || null
            }
            return cache[id]
        }
    })()

    export const isIdExists = (id: string): boolean => {
        return isNotNull(findById(id))
    }

    export const findBy = (() => {
        const cache = {}

        return <K extends Keys<HTMLElementTagNameMap>>(
            id: string,
            el: K,
        ): Optional<HTMLCollectionOf<HTMLElementTagNameMap[K]>> => {
            const a = id + el
            if (cache[a] === undefined) {
                const obj = document.getElementById(id)
                if (obj) {
                    cache[a] = obj.getElementsByTagName(el || '*') || null
                } else {
                    cache[a] = false
                }
            }

            return cache[a]
        }
    })()

    export const getAnchorFromURI = (uri: string): string => {
        return uri.slice(uri.lastIndexOf('#') + 1)
    }

    export const hasClass = (name: string, type): HTMLElementTagNameMap[] => {
        const res: HTMLElementTagNameMap[] = []
        // Locate the class name (allows for multiple class names)
        const re = new RegExp(`(^|\\s)${name}(\\s|$)`)
        // Limit search by type, or look through all elements
        const e = document.getElementsByTagName(type || '*')

        // eslint-disable-next-line @typescript-eslint/prefer-for-of
        for (let j = 0; j < e.length; j++) {
            // If the element has the class, add it for return
            if (re.test(e[j])) {
                res.push(e[j])
            }
        }

        return res
    }

    export const attr = (elem, name: string, value: string): Optional<string> => {
        // Make sure that a valid name was provided
        if (!name || name.constructor !== String) {
            return ''
        }
        // Figure out if the name is one of the weird naming cases
        name = { for: 'htmlFor', class: 'className' }[name] || name

        if (typeof value != 'undefined') {
            // Set the quick way first
            elem[name] = value
            // If we can, use setAttribute
            if (elem.setAttribute) {
                elem.setAttribute(name, value)
            }
            // Return the value of the attribute
            return elem[name] || elem.getAttribute(name) || ''
        }

        return null
    }

    export const create = (elem: string): HTMLElement => {
        return document.createElementNS
            ? document.createElementNS('http://www.w3.org/1999/xhtml', elem)
            : document.createElement(elem)
    }

    export const getStyle = (elem: any, name: string): Optional<string> => {
        // If the property exists in style[], then it's been set
        // recently (and is current)
        if (elem.style[name]) {
            return elem.style[name]
        } else if (elem.currentStyle) {
            return elem.currentStyle[name]
        } else if (document.defaultView && document.defaultView.getComputedStyle) {
            // It uses the traditional 'text-align' style of rule writing,
            // instead of textAlign
            name = name.replace(/([A-Z])/g, '-$1')
            name = name.toLowerCase()
            // Get the style object and get the value of the property (if it exists)
            const s = document.defaultView.getComputedStyle(elem, '')

            return s && s.getPropertyValue(name)
        }

        return null
    }

    // Find the X (Horizontal, Left) position of an element
    export const pageX = (elem: any): any => {
        return elem && elem.offsetParent ? elem.offsetLeft + pageX(elem.offsetParent) : elem.offsetLeft
    }

    // Find the Y (Vertical, Top) position of an element
    export const pageY = (elem: any): any => {
        return elem && elem.offsetParent ? elem.offsetTop + pageY(elem.offsetParent) : elem.offsetTop
    }

    // Find the horizontal positioing of an element within its parent
    export const parentX = (elem: any): any => {
        return elem && elem.parentNode === elem.offsetParent
            ? elem.offsetLeft
            : pageX(elem) - pageX(elem.parentNode)
    }

    // Find the vertical positioning of an element within its parent
    export const parentY = (elem: any): any => {
        return elem && elem.parentNode === elem.offsetParent
            ? elem.offsetTop
            : pageY(elem) - pageY(elem.parentNode)
    }

    // Find the left position of an element
    export const posX = (elem: any): Optional<number> => {
        const value = getStyle(elem, 'left')
        return value ? parseInt(value) : null
    }

    // Find the top position of an element
    export const posY = (elem: any): Optional<number> => {
        const value = getStyle(elem, 'top')
        return value ? parseInt(value) : null
    }

    // A function for setting the horizontal position of an element
    export const setX = (elem: any, pos: number): void => {
        elem.style.left = `${pos}px`
    }

    // A function for setting the vertical position of an element
    export const setY = (elem: any, pos: number): void => {
        elem.style.top = `${pos}px`
    }

    // Get the actual height (using the computed CSS) of an element
    export const getHeight = (elem: any): Optional<number> => {
        const value = getStyle(elem, 'height')
        return value ? parseInt(value) : null
    }

    // Get the actual width (using the computed CSS) of an element
    export const getWidth = (elem: any): Optional<number> => {
        // Gets the computed CSS value and parses out a usable number
        const value = getStyle(elem, 'width')
        return value ? parseInt(value) : null
    }

    // A function used for setting a set of CSS properties, which // can then be restored back again later
    export const resetCSS = (elem: any, prop: any): any => {
        const old = {}
        // Go through each of the properties
        for (const value in prop) {
            if (hasOwnProp.call(prop, value)) {
                old[value] = elem.style[value]
                // And set the new value
                elem.style[value] = prop[value]
            }
        }

        return old
    }

    // Find the full, possible, height of an element (not the actual, // current, height)
    export const fullHeight = (elem: any): number => {
        // If the element is being displayed, then offsetHeight
        // should do the trick, barring that, getHeight() will work
        if (getStyle(elem, 'display') !== 'none') return elem.offsetHeight || getHeight(elem)
        // Otherwise, we have to deal with an element with a display
        // of none, so we need to reset its CSS properties to get a more
        // accurate reading
        const old = resetCSS(elem, { display: '', visibility: 'hidden', position: 'absolute' })
        // Figure out what the full height of the element is, using clientHeight
        // and if that doesn't work, use getHeight
        const h = elem.clientHeight || getHeight(elem)
        // Finally, restore the CSS properties back to what they were
        restoreCSS(elem, old)
        // and return the full height of the element
        return h
    }

    export const fullWidth = (elem: any): number => {
        // If the element is being displayed, then offsetWidth
        // should do the trick, barring that, getWidth() will work
        if (getStyle(elem, 'display') !== 'none') return elem.offsetWidth || getWidth(elem)
        // Otherwise, we have to deal with an element with a display
        // of none, so we need to reset its CSS properties to get a more
        // accurate reading
        const old = resetCSS(elem, { display: '', visibility: 'hidden', position: 'absolute' })
        // Figure out what the full width of the element is, using clientWidth
        // and if that doesn't work, use getWidth
        const w = elem.clientWidth || getWidth(elem)
        // Finally, restore the CSS properties back to what they were
        restoreCSS(elem, old)
        // and return the full width of the element
        return w
    }

    // Set an opacity level for an element
    // (where level is a number 0-100)
    export const setOpacity = (elem, level): void => {
        if (elem.filters) {
            elem.style.filters = `alpha(opacity=${level})`
        } else {
            elem.style.opacity = level / 100
        }
    }

    // Find the horizontal position of the cursor
    export const getX = (e: any): number => {
        // Check for the non-IE position, then the IE position
        return e.pageX || e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft)
    }

    // Find the vertical position of the cursor
    export const getY = (e: any): number => {
        // Normalize the event object
        return e.pageY || e.clientY + (document.documentElement.scrollTop || document.body.scrollTop)
    }

    // Returns the height of the web page // (could change if new content is added to the page)
    export const pageHeight = (): number => {
        return document.body.scrollHeight
    }

    // Returns the width of the web page
    export const pageWidth = (): number => {
        return document.body.scrollWidth
    }

    // A function for determining how far horizontally the browser is scrolled
    export const scrollX = (): number => {
        // A shortcut, in case we're using Internet Explorer 6 in Strict Mode
        const e = document.documentElement
        // If the pageXOffset of the browser is available, use that
        return (
            self.pageXOffset ||
            // Otherwise, try to get the scroll left off of the root node
            (e && e.scrollLeft) ||
            // Finally, try to get the scroll left off of the body element
            document.body.scrollLeft
        )
    }

    // A function for determining how far vertically the browser is scrolled
    export const scrollY = (): number => {
        // A shortcut, in case we're using Internet Explorer 6 in Strict Mode
        const e = document.documentElement
        // If the pageYOffset of the browser is available, use that
        return (
            self.pageYOffset ||
            // Otherwise, try to get the scroll top off of the root node
            (e && e.scrollTop) ||
            // Finally, try to get the scroll top off of the body element
            document.body.scrollTop
        )
    }

    // Find the height of the viewport
    export const windowHeight = (): number => {
        // A shortcut, in case we're using Internet Explorer 6 in Strict Mode
        const e = document.documentElement
        // If the innerHeight of the browser is available, use that
        return (
            self.innerHeight ||
            // Otherwise, try to get the height off of the root node
            (e && e.clientHeight) ||
            // Finally, try to get the height off of the body element
            document.body.clientHeight
        )
    }

    // Find the width of the viewport
    export const windowWidth = (): number => {
        // A shortcut, in case we're using Internet Explorer 6 in Strict Mode
        const e = document.documentElement
        // If the innerWidth of the browser is available, use that
        return (
            self.innerWidth ||
            // Otherwise, try to get the width off of the root node
            (e && e.clientWidth) ||
            // Finally, try to get the width off of the body element
            document.body.clientWidth
        )
    }

    export const restoreCSS = (elem: any, prop: any): void => {
        // Reset all the properties back to their original values
        for (const value in prop) {
            if (hasOwnProp.call(prop, value)) {
                elem.style[value] = prop[value]
            }
        }
    }

    export const hasAttribute = (elem: Element, name: string): boolean => {
        return elem.getAttribute(name) != null
    }

    /**
     * Helper for making Elements with attributes
     *
     * @param  {string} tagName           - new Element tag name
     * @param  {Array|string} classNames  - list or name of CSS classname(s)
     * @param  {object} attributes        - any attributes
     * @returns {Element}
     */
    export const make = <K extends Keys<HTMLElementTagNameMap>>(
        tagName: K,
        classNames: string[] = [],
        attributes = {},
    ): any => {
        const elem = document.createElement(tagName)

        if (Array.isArray(classNames)) {
            elem.classList.add(...classNames)
        } else if (classNames) {
            elem.classList.add(classNames)
        }

        for (const attrName in attributes) {
            elem[attrName] = attributes[attrName]
        }

        return elem
    }

    /**
     * True if the browser supports the HTML5 canvas element
     * @member {Boolean} supportsCanvas
     */
    export const supportsCanvas = ((): boolean => {
        const canvasElement = document.createElement('canvas')

        return !!(isFunction(canvasElement.getContext) && canvasElement.getContext('2d'))
    })()

    /**
     * True if the browser supports the EventTarget.addEventListener() method
     * @member {Boolean} supportsAddEventListener
     */
    export const supportsAddEventListener = ((): boolean => {
        return !!(document.documentElement.addEventListener && document.addEventListener)
    })()

    /**
     * True if the browser supports the EventTarget.removeEventListener() method
     * @member {Boolean} supportsRemoveEventListener
     */
    export const supportsRemoveEventListener = ((): boolean => {
        return !!(document.documentElement.removeEventListener && document.removeEventListener)
    })()

    /**
     * Test whether the submitted canvas is tainted or not.
     * @argument {Canvas} canvas The canvas to test.
     * @returns {Boolean} True if the canvas is tainted.
     */
    export const isCanvasTainted = (canvas): boolean => {
        let isTainted = false
        try {
            // We test if the canvas is tainted by retrieving data from it.
            // An exception will be raised if the canvas is tainted.
            canvas.getContext('2d').getImageData(0, 0, 1, 1)
        } catch (e) {
            isTainted = true
        }

        return isTainted
    }

    /**
     * A ratio comparing the device screen's pixel density to the canvas's backing store pixel density,
     * clamped to a minimum of 1. Defaults to 1 if canvas isn't supported by the browser.
     * @member {Number} pixelDensityRatio
     * @memberof OpenSeadragon
     */
    export const pixelDensityRatio = ((): number => {
        if (supportsCanvas) {
            const context = document.createElement('canvas').getContext('2d')
            const devicePixelRatio = window.devicePixelRatio || 1

            if (!context) {
                throw valueError('Invalid canvas context')
            }

            const backingStoreRatio =
                context['webkitBackingStorePixelRatio'] ||
                context['mozBackingStorePixelRatio'] ||
                context['msBackingStorePixelRatio'] ||
                context['oBackingStorePixelRatio'] ||
                context['backingStorePixelRatio'] ||
                1

            return Math.max(devicePixelRatio, 1) / backingStoreRatio
        }

        return 1
    })()

    export const isIOSDevice = (): boolean => {
        if (typeof navigator !== 'object') {
            return false
        }

        const userAgent = navigator.userAgent

        return userAgent.includes('iPhone') || userAgent.includes('iPad') || userAgent.includes('iPod')
    }

    export const cssStyleLinkGenerator = (href: string): string => {
        return `<link rel="stylesheet" href="${href}" type="text/css"/>`
    }

    export const cssStyleTagGenerator = (content: string): string => {
        return `<style type="text/css">${content}</style>`
    }

    export const getPrintStyleForExports = (): string => {
        return `
                <style media="print">
                    pre code {
                      white-space: pre-wrap;
                    }
                </style>
                `
    }

    export const getOsName = (): OsNameOptions => {
        if (navigator.appVersion.includes('Win')) return 'windows'
        if (navigator.appVersion.includes('Mac')) return 'macos'
        if (navigator.appVersion.includes('X11')) return 'unix'
        if (navigator.appVersion.includes('Linux')) return 'linux'

        return 'unknown'
    }

    export const wrapContentInThemeHtml = (content: string, generalThemeName: string): string => {
        return `
                <div class="${generalThemeName}">
                  ${content}
                </div>
                `
    }

    export const isInternalLink = (link: string): boolean => link.startsWith('#')

    export const combineHtmlElementsIntoHtmlDocumentString = (
        bodyContent: string,
        css?: string,
        htmlMeta?: string,
    ): string => {
        return `
                    <!doctype html>
                    <html lang="en">
                    <head>
                    ${htmlMeta ? htmlMeta : ''}
                    ${css ? css : ''}
                    </head>
                    <body>
                      ${bodyContent}
                    </body>
                    </html>
                `
    }

    export const autolink = (data: string): string => {
        return data.replace(URL_REGEX4, '<a target="_blank" href="$1">$1</a> ')
    }

    export const isChildNode = (parent?: Optional<Node>, child?: Optional<Node | EventTarget>): boolean => {
        if (parent == null || child == null) {
            return false
        }

        let target = child as Optional<Node>
        while (target != null) {
            target = target.parentNode
            if (parent === target) {
                return true
            }
        }

        return false
    }
}
