import { Checkers, Utils } from '../src'
import isFunction = Checkers.isFunction
import Commons = Utils.Commons

const I18N = {
    Errors: {
        Dzc: "Sorry, we don't support Deep Zoom Collections!",
        Dzi: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
        Xml: "Hmm, this doesn't appear to be a valid Deep Zoom Image.",
        ImageFormat: "Sorry, we don't support {0}-based Deep Zoom Images.",
        Security: 'It looks like a security restriction stopped us from loading this Deep Zoom Image.',
        Status: 'This space unintentionally left blank ({0} {1}).',
        OpenFailed: 'Unable to open {0}: {1}',
    },

    Tooltips: {
        FullPage: 'Toggle full page',
        Home: 'Go home',
        ZoomIn: 'Zoom in',
        ZoomOut: 'Zoom out',
        NextPage: 'Next page',
        PreviousPage: 'Previous page',
        RotateLeft: 'Rotate left',
        RotateRight: 'Rotate right',
        Flip: 'Flip Horizontally',
    },
}

export const propKeys = ((globals, i18n: any) => {
    const getString = (prop: string, ...args: any[]): string => {
        const props = prop.split('.')
        let string = '',
            container = i18n,
            i

        for (i = 0; i < props.length - 1; i++) {
            // in case not a subproperty
            container = container[props[i]] || {}
        }
        string = container[props[i]]

        console.log('Untranslated source string:', prop)

        return string.replace(/{\d+}/g, function (capture) {
            const i = parseInt(capture.match(/\d+/)?.toString() || '', 10) + 1
            return i < args.length ? args[i] : ''
        })
    }

    /**
     * @function
     * @param prop property name to update value by
     * @param value property value to update with
     */
    const setString = (prop: string, value: any): void => {
        const props = prop.split('.')
        let container = i18n,
            i

        for (i = 0; i < props.length - 1; i++) {
            if (!container[props[i]]) {
                container[props[i]] = {}
            }
            container = container[props[i]]
        }

        container[props[i]] = value
    }

    if (!isFunction(globals['getString'])) {
        Commons.defineStaticProperty(globals, 'getString', {
            value: (prop: string, ...args: any[]) => getString(prop, args),
        })
    }

    if (!isFunction(globals['setString'])) {
        Commons.defineStaticProperty(globals, 'setString', {
            value: (prop: string, value: any) => setString(prop, value),
        })
    }
})(window || {}, I18N)
