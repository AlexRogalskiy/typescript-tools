import mime from 'mime-types'

class MimeType {
    readonly type: string
    readonly subtype: string
    readonly charset?: string

    constructor(type: string, subtype: string, charset?: string) {
        this.type = type.toLowerCase()
        this.subtype = subtype?.toLowerCase() ?? ''
        this.charset = charset
    }

    get essence(): string {
        return `${this.type}/${this.subtype}`
    }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class MimeUtility {
    private static readonly supportedImagesFormats = [
        'image/jpeg',
        'image/gif',
        'image/webp',
        'image/png',
        'image/bmp',
    ]

    static parse(contentTypeString: string): MimeType {
        // application/json; charset=utf-8
        // application/vnd.github.chitauri-preview+sha
        const [essence, ...parameters] = contentTypeString.split(';').map(v => v.trim())
        const [type, subtype] = essence.split('/')
        const charset = parameters.find(p => p.startsWith('charset='))?.split('=')[1]
        return new MimeType(type, subtype, charset)
    }

    static getExtension(
        contentTypeString: string | undefined,
        mimeAndFileExtensionMapping: { [key: string]: string },
    ): string {
        if (!contentTypeString) {
            return ''
        }

        const { essence } = this.parse(contentTypeString)

        // Check if user has custom mapping for this content type first
        if (essence in mimeAndFileExtensionMapping) {
            const ext = mimeAndFileExtensionMapping[essence]
            return ext.replace(/^(\.)+/, '')
        }
        return mime.extension(contentTypeString) || ''
    }

    static isBrowserSupportedImageFormat(contentTypeString: string | undefined): boolean {
        // https://en.wikipedia.org/wiki/Comparison_of_web_browsers#Image_format_support
        // For chrome supports JPEG, GIF, WebP, PNG and BMP
        if (!contentTypeString) {
            return false
        }

        const { essence } = this.parse(contentTypeString)
        return this.supportedImagesFormats.includes(essence)
    }

    static isJSON(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        const { subtype, essence } = this.parse(contentTypeString)
        return essence === 'application/json' || subtype.endsWith('+json') || subtype.startsWith('x-amz-json')
    }

    static isXml(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        const { subtype, essence } = this.parse(contentTypeString)
        return essence === 'application/xml' || essence === 'text/xml' || subtype.endsWith('+xml')
    }

    static isHtml(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'text/html'
    }

    static isJavaScript(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        const essence = this.parse(contentTypeString).essence
        return essence === 'application/javascript' || essence === 'text/javascript'
    }

    static isCSS(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'text/css'
    }

    static isMultiPartMixed(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'multipart/mixed'
    }

    static isMultiPartFormData(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'multipart/form-data'
    }

    static isFormUrlEncoded(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'application/x-www-form-urlencoded'
    }

    static isNewlineDelimitedJSON(contentTypeString: string | undefined): boolean {
        if (!contentTypeString) {
            return false
        }

        return this.parse(contentTypeString).essence === 'application/x-ndjson'
    }
}
