export const PARAM_TYPES = {
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

type OneOf<T extends CombinedSheetTypes[]> = {
    name: 'ONEOF'
    types: T
}

type List<T extends CombinedSheetTypes> = {
    name: 'LIST'
    type: T
}

type Any = {
    name: 'ANY'
}

type Number = {
    name: 'NUMBER'
    min?: number
    max?: number
}

type Int = {
    name: 'INT'
    min?: number
    max?: number
}

type Text = {
    name: 'TEXT'
}

type Json = {
    name: 'JSON'
}

type Bool = {
    name: 'BOOL'
    strict?: boolean
}

type Reference = {
    name: 'REFERENCE'
}

type NonRecursiveTypes = Any | Number | Int | Bool | Json | Text | Reference

type SheetTypes = NonRecursiveTypes | List<SheetTypes2> | Json | OneOf<Exclude<SheetTypes2, OneOf<any[]>>[]>
type SheetTypes2 = NonRecursiveTypes | List<SheetTypes3> | Json | OneOf<Exclude<SheetTypes3, OneOf<any[]>>[]>
type SheetTypes3 = NonRecursiveTypes | List<SheetTypes4> | Json | OneOf<Exclude<SheetTypes4, OneOf<any[]>>[]>
type SheetTypes4 = NonRecursiveTypes | List<SheetTypes5> | Json | OneOf<Exclude<SheetTypes5, OneOf<any[]>>[]>
type SheetTypes5 = NonRecursiveTypes | List<Any> | Json

type CombinedSheetTypes = SheetTypes | SheetTypes2 | SheetTypes3 | SheetTypes4 | SheetTypes5

export interface I18N {
    de: string
    en: string
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

export interface SheetFunction {
    name: I18N
    description: I18N
    parameters: SheetParam[]
    repeatParams?: string[]
}
