import slugify from 'slugify'

export const isNonEmptyString = (str: string): boolean => {
    return str !== undefined && str !== null && str.length > 0
}

export const isBlankString = (str: string): boolean => {
    return !str || /^\s*$/.test(str)
}

export const notBlankOrElse = (str: string, defaultValue: string): string => {
    return isBlankString(str) ? defaultValue : str
}

export const toString = (str: string | string[]): string => {
    return Array.isArray(str) ? str[0] : str
}

export const getProjectId = (project: any): string => {
    return slugify(project.name, { lower: true, remove: /[.'/]/g })
}
