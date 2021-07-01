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

type ParamTypeResolver<T extends SheetTypes> = T extends BASIC_TYPES ? BasicTypes1<T> : never

// type ParamObjectResolver<T extends SheetParam<any> = ParamTypeResolver<T['type']>;

export type ParamObjectResolver<T extends { [key: string]: SheetTypes }> = {
    [P in keyof T]: ParamTypeResolver<T[P]>
}

// type InferedKeyIn<T extends { [key: string]: BASIC_TYPES }> = {
// 	[P in keyof T]: ParamObjectResolver<T, SheetParam<T>>
// };

// const nanana2: InferedKeyIn<{
// 	id: 'condition';
// 	name: {
// 		de: 'Condition';
// 		en: 'condition';
// 	};
// 	type: { name: 'BOOL' };
// 	description: {
// 		de: '';
// 		en: '';
// 	};
// }> = {condition: true};

// type ParamTypeArrayResolver<T extends Array> = T extends

export interface Helper<T extends ParamType> {
    [key: string]: T
}

export type Unifier<T extends { [key: string]: BASIC_TYPES }> = BaseSheetParam<T>

export const testp: Unifier<{ condition: BASIC_TYPES }> = {
    id: 'condition',
    name: {
        de: 'Condition',
        en: 'condition',
    },
    type: { name: 'BOOL' },
    description: {
        de: '',
        en: '',
    },
}

interface BaseSheetParam<T> {
    id: keyof T
    name: I18N
    type: SheetTypes
    description: I18N
}

export const bsp2: Unifier<{
    condition: { name: 'BOOL' }
}> = {
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

export type RequiredSheetParam<T> = BaseSheetParam<T>

export interface OptionalSheetParam<T> extends BaseSheetParam<T> {
    optional: true
}

export interface DefaultingSheetParam<T> extends BaseSheetParam<T> {
    defaultValue: any
}

export type SheetParam<T> = RequiredSheetParam<T> | OptionalSheetParam<T> | DefaultingSheetParam<T>
// interface Nanannu {
// 	[key: string]: ParamTypeObject
// }

export interface SheetFunction<T> {
    id: string
    name: string | I18N
    description: I18N
    parameters: SheetParam<T>[]
    repeatParams?: keyof T[]
}

function func2<T>(def: SheetFunction<T>): SheetFunction<T> {
    return def
}

export const IF = func2({
    id: 'IF',
    name: {
        de: 'IF',
        en: 'IF',
    },
    description: {
        de: '',
        en: '',
    },
    parameters: [
        {
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
        },
        {
            id: 'trueValue',
            name: {
                de: 'WahrWert',
                en: 'true_value',
            },
            type: { name: PARAM_TYPES.ANY },
            description: {
                de: '',
                en: '',
            },
        },
        {
            id: 'falseValue',
            name: {
                de: 'FalschWert',
                en: 'false_vale',
            },
            type: { name: PARAM_TYPES.ANY },
            description: {
                de: '',
                en: '',
            },
        },
    ],
})
