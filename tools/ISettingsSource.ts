export interface ISettingsSource {
    has: (key: any) => boolean
    getValue: (key: any) => any | undefined
    setValue: (key: any, value: any) => void
}
