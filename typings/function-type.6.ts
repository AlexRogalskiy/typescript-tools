export const PARAM_TYPES: ParamTypeNames = {
    NUMBER: 'NUMBER',
    INT: 'INT',
    TEXT: 'TEXT',
    BOOL: 'BOOL',
    ENUM: 'ENUM',
    JSON: 'JSON',
    REFERENCE: 'REFERENCE',
    LIST: 'LIST',
    ONEOF: 'ONEOF',
    ANY: 'ANY',
} as const

export interface ParamTypeNames {
    NUMBER: 'NUMBER'
    INT: 'INT'
    TEXT: 'TEXT'
    BOOL: 'BOOL'
    ENUM: 'ENUM'
    JSON: 'JSON'
    REFERENCE: 'REFERENCE'
    LIST: 'LIST'
    ONEOF: 'ONEOF'
    ANY: 'ANY'
}

export interface ParamTypeObject {
    name: keyof ParamTypeNames

    [key: string]: any
}

export type ParamType = keyof ParamTypeNames | ParamTypeObject

export interface I18N {
    de: string
    en: string
}

export type Pew<T> = T extends 'NUMBER'
    ? number
    : T extends 'INT'
    ? number
    : T extends 'BOOL'
    ? boolean
    : T extends 'TEXT'
    ? string
    : T extends 'ENUM'
    ? string
    : T extends 'JSON'
    ? object
    : T extends 'REFERENCE'
    ? object
    : T extends 'ANY'
    ? any
    : unknown

export type PName =
    | 'NUMBER'
    | 'INT'
    | 'TEXT'
    | 'BOOL'
    | 'ENUM'
    | 'JSON'
    | 'REFERENCE'
    | 'LIST'
    | 'ONEOF'
    | 'ANY'

type ONEOF<T extends BASIC_TYPES[]> = {
    name: 'ONEOF'
    types: T
}

type LIST<T extends BASIC_TYPES> = {
    name: 'LIST'
    type: T
}

type ANY = {
    name: 'ANY'
}

type NUMBER = {
    name: 'NUMBER'
    min?: number
    max?: number
}

type INT = {
    name: 'INT'
    min?: number
    max?: number
}

type TEXT = {
    name: 'TEXT'
}

type JSON = {
    name: 'JSON'
}

type BOOL = {
    name: 'BOOL'
    strict?: boolean
}

type NonRecursiveTypes<T extends BASIC_TYPES> = T extends INT | NUMBER
    ? number
    : T extends BOOL
    ? boolean
    : T extends TEXT
    ? string
    : T extends JSON
    ? object
    : T extends ANY
    ? any
    : unknown

type BasicTypes1<T extends BASIC_TYPES> = T extends LIST<infer U>
    ? BasicTypes2<U>[]
    : T extends ONEOF<infer U>
    ? BasicTypes2<U[number]>
    : NonRecursiveTypes<T>

type BasicTypes2<T extends BASIC_TYPES> = T extends LIST<infer U>
    ? BasicTypes3<U>[]
    : T extends ONEOF<infer U>
    ? BasicTypes3<U[number]>
    : NonRecursiveTypes<T>

type BasicTypes3<T extends BASIC_TYPES> = T extends LIST<infer U>
    ? BasicTypes4<U>[]
    : T extends ONEOF<infer U>
    ? BasicTypes4<U[number]>
    : NonRecursiveTypes<T>
type BasicTypes4<T extends BASIC_TYPES> = T extends LIST<infer U>
    ? BasicTypes5<U>[]
    : T extends ONEOF<infer U>
    ? BasicTypes5<U[number]>
    : NonRecursiveTypes<T>
type BasicTypes5<T extends BASIC_TYPES> = T extends LIST<any>
    ? any[]
    : T extends ONEOF<infer U>
    ? NonRecursiveTypes<U[number]>
    : NonRecursiveTypes<T>

type NON_RECURSIVE_TYPES = ANY | NUMBER | INT | BOOL | JSON | TEXT

type BASIC_TYPES1 =
    | NON_RECURSIVE_TYPES
    | LIST<BASIC_TYPES2>
    | JSON
    | ONEOF<Exclude<BASIC_TYPES2, ONEOF<any[]>>[]>
type BASIC_TYPES2 =
    | NON_RECURSIVE_TYPES
    | LIST<BASIC_TYPES3>
    | JSON
    | ONEOF<Exclude<BASIC_TYPES3, ONEOF<any[]>>[]>
type BASIC_TYPES3 =
    | NON_RECURSIVE_TYPES
    | LIST<BASIC_TYPES4>
    | JSON
    | ONEOF<Exclude<BASIC_TYPES4, ONEOF<any[]>>[]>
type BASIC_TYPES4 =
    | NON_RECURSIVE_TYPES
    | LIST<BASIC_TYPES5>
    | JSON
    | ONEOF<Exclude<BASIC_TYPES5, ONEOF<any[]>>[]>
type BASIC_TYPES5 = NON_RECURSIVE_TYPES | LIST<ANY> | JSON

type BASIC_TYPES = BASIC_TYPES1 | BASIC_TYPES2 | BASIC_TYPES3 | BASIC_TYPES4 | BASIC_TYPES5

type SheetTypes = BASIC_TYPES

type ParamTypeResolver<T> = T extends SheetTypes ? BasicTypes1<T> : never

// type ParamObjectResolver<T extends SheetParam<any> = ParamTypeResolver<T['type']>;

type ParamObjectResolver<T> = { [P in keyof T]: ParamTypeResolver<T[P]> }
type ParamArrayResolver<X> = X extends SheetParam[] ? U<X> : unknown

export const y: ParamTypeResolver<{ name: 'BOOL' }> = true
export const aa: ParamTypeResolver<{ name: 'ONEOF'; types: [{ name: 'BOOL' }, { name: 'JSON' }] }> = { a: 1 }
export const list1: ParamTypeResolver<{
    name: 'LIST'
    type: {
        name: 'ONEOF'
        types: [{ name: 'BOOL' }, { name: 'JSON' }, { name: 'LIST'; type: { name: 'NUMBER' } }]
    }
}> = [true, { a: 1 }, [1, 2, 3, 4]]

export const list2: ParamTypeResolver<{
    name: 'LIST'
    type: { name: 'LIST'; type: { name: 'LIST'; type: { name: 'BOOL' } } }
}> = [[[false]]]

export type XXX<U> = U extends SheetParamObject<infer T, infer P>
    ? { [K in keyof T]: SheetParamResolver<P> }
    : never

type u = 'a' | 'b' | 'c'
export type X = { [x in u]: string }

// type SheetParamResolver<T> = T extends SheetParam ? ParamTypeResolver<T['type']> : never;
type SheetParamResolver<T> = T extends OptionalSheetParam
    ? ParamTypeResolver<T['type']> | undefined
    : T extends SheetParam
    ? ParamTypeResolver<T['type']>
    : never

export type SheetParamsResolver<T> = { [P in keyof T]: SheetParamResolver<T[P]> }

type U<T extends any[]> = ParamTypeResolver<T[number]['type']>

export const xxx: ParamArrayResolver<
    [
        {
            id: 'condition'
            name: {
                de: 'Condition'
                en: 'condition'
            }
            type: { name: 'BOOL' }
            description: {
                de: ''
                en: ''
            }
        },
        {
            id: 'trueValue'
            name: {
                de: 'WahrWert'
                en: 'true_value'
            }
            type: { name: 'ANY' }
            description: {
                de: ''
                en: ''
            }
        },
        {
            id: 'falseValue'
            name: {
                de: 'FalschWert'
                en: 'false_vale'
            }
            type: { name: 'ANY' }
            description: {
                de: ''
                en: ''
            }
        },
    ]
> = {
    condition: 1,
    falseValue: {},
    trueValue: 'string',
}

export const nanana: ParamObjectResolver<{
    condition: { name: 'BOOL' }
    falseValue: { name: 'ANY' }
}> = { condition: false, falseValue: true }

export const bsp3: SheetParam = {
    id: 'condition',
    name: {
        de: 'Condition',
        en: 'condition',
    },
    type: { name: PARAM_TYPES.BOOL },
    description: {
        de: '',
        en: '',
    },
}

interface BaseSheetParam {
    id: string
    name: I18N
    type: SheetTypes
    description: I18N
}

export type RequiredSheetParam = BaseSheetParam

export interface OptionalSheetParam extends BaseSheetParam {
    optional: true
}

export interface DefaultingSheetParam extends BaseSheetParam {
    defaultValue: any
}

export type SheetParam = RequiredSheetParam | OptionalSheetParam | DefaultingSheetParam

type SheetParamObject<K, T extends SheetParam> = {
    [P in keyof K]: T
}

// interface Nanannu {
// 	[key: string]: ParamTypeObject
// }

export interface SheetFunction {
    name: I18N
    description: I18N
    parameters: SheetParam[]
}

export interface tester {
    condition: boolean
    trueValue: any
    falseValue: any
}
