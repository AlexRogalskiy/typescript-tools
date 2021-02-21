export namespace Browsers {
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
}
