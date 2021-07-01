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

interface BaseSheetParam<T> {
    id: keyof T
    name: I18N
    type: ParamType
    description: I18N
}

type Pew<T> = T extends 'NUMBER'
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

type PName = 'NUMBER' | 'INT' | 'TEXT' | 'BOOL' | 'ENUM' | 'JSON' | 'REFERENCE' | 'LIST' | 'ONEOF' | 'ANY'

// https://github.com/Microsoft/TypeScript/issues/25719

export type XX<T extends any[]> = T extends [infer U]
    ? Pew<U> // T extends [infer U, infer ...Array] ? Pew<U> | XX<Q> :
    : unknown

export type U<T extends any[], U = never> = T[number] | U

export type OneOf<T extends PName[]> = {
    name: 'ONEOF'
    types: T
}

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

export type Other<T extends PName> = {
    name: T
}

type MostBasicParam<T extends BASIC_TYPES> = T extends INT | NUMBER
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

type BasicParam<T extends BASIC_TYPES> = T extends LIST<infer U> ? MostBasicParam<U>[] : MostBasicParam<T>

// type Nana = T extends

// interface Nana<T extends BASIC_TYPES> extends BasicParam<T> {}

export type BASIC_TYPES = ANY | NUMBER | INT | BOOL | JSON | TEXT

export type ILIST = LIST<BASIC_TYPES>

export type TYPES = ONEOF<BASIC_TYPES[]> | BASIC_TYPES

export type Omit<T, K> = Pick<T, Exclude<keyof T, K>>

export type ParamPew<T extends TYPES> = T extends ONEOF<infer U>
    ? BasicParam<U[number]>
    : T extends BASIC_TYPES
    ? BasicParam<T>
    : never

export type RequiredSheetParam<T> = BaseSheetParam<T>

export interface OptionalSheetParam<T> extends BaseSheetParam<T> {
    optional: true
}

export interface DefaultingSheetParam<T> extends BaseSheetParam<T> {
    defaultValue: any
}

export type SheetParam<T> = RequiredSheetParam<T> | OptionalSheetParam<T> | DefaultingSheetParam<T>

export type ParamObject<T> = { [P in keyof T]: SheetParam<T> }

// export type ResultObject<T> = {
// 	[P in keyof T]: Pew<T>
// }

export interface SheetFunction<T> {
    id: string
    name: string | I18N
    description: I18N
    parameters: SheetParam<T>[]
    repeatParams?: keyof T[]
}
