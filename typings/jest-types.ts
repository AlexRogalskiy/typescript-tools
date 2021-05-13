// -------------------------------------------------------------------------------------------------
export namespace jest {
    export interface StyleRuleOptions {
        readonly target?: string
        readonly media?: string
    }

    export interface Matchers<R> {
        toHaveStyleRule(property: string, value: any, options?: StyleRuleOptions): R
    }
}
// -------------------------------------------------------------------------------------------------
