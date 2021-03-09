import 'jsdom-global/register'
import { Browsers } from "../src";

export namespace Browsers_Test {
    import replaceURLWithHTMLLinks = Browsers.replaceUrlWithHtmlLinks;
    import createElement = Browsers.make;
    import hasAttribute = Browsers.hasAttribute;
    import windowWidth = Browsers.windowWidth;
    import windowHeight = Browsers.windowHeight;

    beforeAll(() => {
        console.log("Browsers test suite started")
        console.time("Execution time took")
    })

    afterAll(() => {
        console.log("Browsers test suite finished")
        console.timeEnd("Execution time took")
    })

    describe('Check DOM element matches', () => {
        it('it should return true when DOM elements matches', () => {
            const div = document.createElement('div')
            expect(div['matches']('div')).toBeTruthy()

            const span = document.createElement('span')
            expect(span['matches']('div')).toBeFalsy()

            document.body.appendChild(div)
            expect(Element['__matches__'](div, 'div')).toBeTruthy()

            document.body.appendChild(span)
            expect(Element['__matches__'](div, 'span')).toBeFalsy()
        })
    })

    describe('Check DOM element selection', () => {
        it('it should return true when DOM element is selected', () => {
            const div = document.createElement('div')
            div.innerHTML = 'hello'
            document.body.appendChild(div)

            // @ts-ignore
            expect(document.querySelector('body').innerHTML).toEqual('<div>hello</div>')
        })
    })

    describe('Check DOM element contains attribute', () => {
        it('it should return true when DOM element has attribute', () => {
            const div = document.createElement('div')
            div.id = 'id'

            expect(hasAttribute(div, 'id')).toBeTruthy()
            expect(hasAttribute(div, 'name')).toBeFalsy()
        })
    })

    describe('Check DOM window size parameter', () => {
        it('it should return valid size of window element', () => {
            expect(windowWidth()).toEqual(1024)
            expect(windowHeight()).toEqual(768)
        })
    })

    describe('Check DOM global object', () => {
        it('it should return true when DOM properties are not defined', () => {
            expect(typeof global.document === 'undefined').toBeFalsy()
            expect(typeof global.alert === 'undefined').toBeFalsy()
        })
    })

    describe('Check replace url links with html tags', () => {
        it('it should return valid url link DOM element', () => {
            expect(replaceURLWithHTMLLinks('https://www.google.com/')).toEqual("<a href='https://www.google.com/'>https://www.google.com/</a>")
            expect(replaceURLWithHTMLLinks('https://www.google.com/', 'Google')).toEqual("<a href='https://www.google.com/'>Google</a>")
            expect(replaceURLWithHTMLLinks('')).toEqual('')
            expect(replaceURLWithHTMLLinks('', "Test")).toEqual('')
        })
    })

    describe('Check creation of new element', () => {
        it('it should return new valid DOM element', () => {
            const div = createElement('div')
            document.body.appendChild(div)
            // @ts-ignore
            expect(document.querySelector('body').innerHTML).toEqual('<div></div>')

            const div2 = createElement('div', ['test'], {
                'width': '100%',
                'height': '100%'
            })
            document.body.replaceChild(div2, div)
            // @ts-ignore
            expect(document.querySelector('body').innerHTML).toEqual('<div class=\"test\"></div>')

            const span = createElement('span', ['test'])
            document.body.replaceChild(span, div2)
            // @ts-ignore
            expect(document.querySelector('body').innerHTML).toEqual('<span class=\"test\"></span>')

            const span2 = createElement('span', ['test', 'test2'], {
                'width': '100%',
                'height': '100%'
            })
            document.body.replaceChild(span2, span)
            // @ts-ignore
            expect(document.querySelector('body').innerHTML).toEqual('<span class=\"test test2\"></span>')
        })
    })
}
