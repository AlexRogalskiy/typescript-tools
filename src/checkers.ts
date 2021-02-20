import { MOBILE_NAVIGATOR_CODE_REGEX, MOBILE_NAVIGATOR_TYPE_REGEX } from './regex'

export namespace Checkers {
    export const isMobileBrowser = (navigator: string): boolean => {
        return !(
            !MOBILE_NAVIGATOR_TYPE_REGEX.test(navigator) &&
            !MOBILE_NAVIGATOR_CODE_REGEX.test(navigator.substr(0, 4))
        )
    }
}
