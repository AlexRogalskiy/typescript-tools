export enum HeroPattern {
    plus = 'plus',
    topography = 'topography',
    texture = 'texture',
}

export enum CategoryPattern {
    general = 'general',
    life = 'life',
    success = 'success',
    motivational = 'motivational',
    fun = 'fun',
    programming = 'programming',
    entrepreneurship = 'entrepreneurship',
}

export interface ParsedRequest {
    category?: CategoryPattern | undefined
    width?: string
    height?: string
    colorPattern?: string | string[]
    fontColor?: string | string[]
    backgroundColor?: string | string[]
    pattern?: HeroPattern | undefined
    opacity?: string | string[]
}

export interface ColorOptions {
    readonly colorPattern: string | string[]
    readonly fontColor: string | string[]
    readonly backgroundColor: string | string[]
    readonly opacity: string | string[]
    readonly pattern?: string
}

export interface ImageOptions {
    readonly width: string
    readonly height: string
}

export enum Profile {
    dev = 'dev',
    prod = 'prod',
}

export type ProfileOptions = {
    [K in Profile]: string
}

export interface ConfigOptions {
    /**
     * Configuration options.
     */
    readonly options: ProfileOptions
}
