export const enum StandardTokenType {
    Other = 0,
    Comment = 1,
    String = 2,
    RegEx = 4,
}

const enum IgnoreBracketsInTokens {
    value = StandardTokenType.Comment | StandardTokenType.String | StandardTokenType.RegEx,
}

export function ignoreBracketsInToken(standardTokenType: StandardTokenType): boolean {
    return (standardTokenType & IgnoreBracketsInTokens.value) !== 0
}

export const enum MetadataConsts {
    LANGUAGEID_MASK = 255,
    TOKEN_TYPE_MASK = 1792,
    FONT_STYLE_MASK = 14336,
    FOREGROUND_MASK = 8372224,
    BACKGROUND_MASK = 4286578688,
    LANGUAGEID_OFFSET = 0,
    TOKEN_TYPE_OFFSET = 8,
    FONT_STYLE_OFFSET = 11,
    FOREGROUND_OFFSET = 14,
    BACKGROUND_OFFSET = 23,
}

export const enum FontStyle {
    NotSet = -1,
    None = 0,
    Italic = 1,
    Bold = 2,
    Underline = 4,
}

export const enum ColorId {
    None = 0,
    DefaultForeground = 1,
    DefaultBackground = 2,
}

export const enum LanguageId {
    Null = 0,
    PlainText = 1,
}

export interface IViewLineTokens {
    equals(other: IViewLineTokens): boolean

    getCount(): number

    getForeground(tokenIndex: number): ColorId

    getEndOffset(tokenIndex: number): number

    getClassName(tokenIndex: number): string

    getInlineStyle(tokenIndex: number, colorMap: string[]): string

    findTokenIndexAtOffset(offset: number): number
}

export class LineTokens implements IViewLineTokens {
    _lineTokensBrand: void

    private readonly _tokens: Uint32Array
    private readonly _tokensCount: number
    private readonly _text: string

    constructor(tokens: Uint32Array, text: string) {
        this._tokens = tokens
        this._tokensCount = this._tokens.length >>> 1
        this._text = text
    }

    equals(other: IViewLineTokens): boolean {
        if (other instanceof LineTokens) {
            return this.slicedEquals(other, 0, this._tokensCount)
        }
        return false
    }

    slicedEquals(other: LineTokens, sliceFromTokenIndex: number, sliceTokenCount: number): boolean {
        if (this._text !== other._text) {
            return false
        }
        if (this._tokensCount !== other._tokensCount) {
            return false
        }
        const from = sliceFromTokenIndex << 1
        const to = from + (sliceTokenCount << 1)
        for (let i = from; i < to; i++) {
            if (this._tokens[i] !== other._tokens[i]) {
                return false
            }
        }
        return true
    }

    getLineContent(): string {
        return this._text
    }

    getCount(): number {
        return this._tokensCount
    }

    getStartOffset(tokenIndex: number): number {
        if (tokenIndex > 0) {
            return this._tokens[(tokenIndex - 1) << 1]
        }
        return 0
    }

    getLanguageId(tokenIndex: number): LanguageId {
        const metadata = this._tokens[(tokenIndex << 1) + 1]
        return TokenMetadata.getLanguageId(metadata)
    }

    getStandardTokenType(tokenIndex: number): StandardTokenType {
        const metadata = this._tokens[(tokenIndex << 1) + 1]
        return TokenMetadata.getTokenType(metadata)
    }

    getForeground(tokenIndex: number): ColorId {
        const metadata = this._tokens[(tokenIndex << 1) + 1]
        return TokenMetadata.getForeground(metadata)
    }

    getClassName(tokenIndex: number): string {
        const metadata = this._tokens[(tokenIndex << 1) + 1]
        return TokenMetadata.getClassNameFromMetadata(metadata)
    }

    getInlineStyle(tokenIndex: number, colorMap: string[]): string {
        const metadata = this._tokens[(tokenIndex << 1) + 1]
        return TokenMetadata.getInlineStyleFromMetadata(metadata, colorMap)
    }

    getEndOffset(tokenIndex: number): number {
        return this._tokens[tokenIndex << 1]
    }

    /**
     * Find the token containing offset `offset`.
     * @param offset The search offset
     * @return The index of the token containing the offset.
     */
    findTokenIndexAtOffset(offset: number): number {
        return LineTokens.findIndexInTokensArray(this._tokens, offset)
    }

    inflate(): IViewLineTokens {
        return this
    }

    sliceAndInflate(startOffset: number, endOffset: number, deltaOffset: number): IViewLineTokens {
        return new SlicedLineTokens(this, startOffset, endOffset, deltaOffset)
    }

    static convertToEndOffset(tokens: Uint32Array, lineTextLength: number): void {
        const tokenCount = tokens.length >>> 1
        const lastTokenIndex = tokenCount - 1
        for (let tokenIndex = 0; tokenIndex < lastTokenIndex; tokenIndex++) {
            tokens[tokenIndex << 1] = tokens[(tokenIndex + 1) << 1]
        }
        tokens[lastTokenIndex << 1] = lineTextLength
    }

    static findIndexInTokensArray(tokens: Uint32Array, desiredIndex: number): number {
        if (tokens.length <= 2) {
            return 0
        }

        let low = 0
        let high = (tokens.length >>> 1) - 1

        while (low < high) {
            const mid = low + Math.floor((high - low) / 2)
            const endOffset = tokens[mid << 1]

            if (endOffset === desiredIndex) {
                return mid + 1
            } else if (endOffset < desiredIndex) {
                low = mid + 1
            } else if (endOffset > desiredIndex) {
                high = mid
            }
        }

        return low
    }
}

export class SlicedLineTokens implements IViewLineTokens {
    private readonly _source: LineTokens
    private readonly _startOffset: number
    private readonly _endOffset: number
    private readonly _deltaOffset: number

    private readonly _firstTokenIndex: number
    private readonly _tokensCount: number

    constructor(source: LineTokens, startOffset: number, endOffset: number, deltaOffset: number) {
        this._source = source
        this._startOffset = startOffset
        this._endOffset = endOffset
        this._deltaOffset = deltaOffset
        this._firstTokenIndex = source.findTokenIndexAtOffset(startOffset)

        this._tokensCount = 0
        for (let i = this._firstTokenIndex, len = source.getCount(); i < len; i++) {
            const tokenStartOffset = source.getStartOffset(i)
            if (tokenStartOffset >= endOffset) {
                break
            }
            this._tokensCount++
        }
    }

    equals(other: IViewLineTokens): boolean {
        if (other instanceof SlicedLineTokens) {
            return (
                this._startOffset === other._startOffset &&
                this._endOffset === other._endOffset &&
                this._deltaOffset === other._deltaOffset &&
                this._source.slicedEquals(other._source, this._firstTokenIndex, this._tokensCount)
            )
        }
        return false
    }

    getCount(): number {
        return this._tokensCount
    }

    getForeground(tokenIndex: number): ColorId {
        return this._source.getForeground(this._firstTokenIndex + tokenIndex)
    }

    getEndOffset(tokenIndex: number): number {
        const tokenEndOffset = this._source.getEndOffset(this._firstTokenIndex + tokenIndex)
        return Math.min(this._endOffset, tokenEndOffset) - this._startOffset + this._deltaOffset
    }

    getClassName(tokenIndex: number): string {
        return this._source.getClassName(this._firstTokenIndex + tokenIndex)
    }

    getInlineStyle(tokenIndex: number, colorMap: string[]): string {
        return this._source.getInlineStyle(this._firstTokenIndex + tokenIndex, colorMap)
    }

    findTokenIndexAtOffset(offset: number): number {
        return (
            this._source.findTokenIndexAtOffset(offset + this._startOffset - this._deltaOffset) -
            this._firstTokenIndex
        )
    }
}

// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class TokenMetadata {
    static getLanguageId(metadata: number): LanguageId {
        return (metadata & MetadataConsts.LANGUAGEID_MASK) >>> MetadataConsts.LANGUAGEID_OFFSET
    }

    static getTokenType(metadata: number): StandardTokenType {
        return (metadata & MetadataConsts.TOKEN_TYPE_MASK) >>> MetadataConsts.TOKEN_TYPE_OFFSET
    }

    static getFontStyle(metadata: number): FontStyle {
        return (metadata & MetadataConsts.FONT_STYLE_MASK) >>> MetadataConsts.FONT_STYLE_OFFSET
    }

    static getForeground(metadata: number): ColorId {
        return (metadata & MetadataConsts.FOREGROUND_MASK) >>> MetadataConsts.FOREGROUND_OFFSET
    }

    static getBackground(metadata: number): ColorId {
        return (metadata & MetadataConsts.BACKGROUND_MASK) >>> MetadataConsts.BACKGROUND_OFFSET
    }

    static getClassNameFromMetadata(metadata: number): string {
        const foreground = this.getForeground(metadata)
        let className = `mtk${foreground}`

        const fontStyle = this.getFontStyle(metadata)
        if (fontStyle & FontStyle.Italic) {
            className += ' mtki'
        }
        if (fontStyle & FontStyle.Bold) {
            className += ' mtkb'
        }
        if (fontStyle & FontStyle.Underline) {
            className += ' mtku'
        }

        return className
    }

    static getInlineStyleFromMetadata(metadata: number, colorMap: string[]): string {
        const foreground = this.getForeground(metadata)
        const fontStyle = this.getFontStyle(metadata)

        let result = `color: ${colorMap[foreground]};`
        if (fontStyle & FontStyle.Italic) {
            result += 'font-style: italic;'
        }
        if (fontStyle & FontStyle.Bold) {
            result += 'font-weight: bold;'
        }
        if (fontStyle & FontStyle.Underline) {
            result += 'text-decoration: underline;'
        }
        return result
    }
}
