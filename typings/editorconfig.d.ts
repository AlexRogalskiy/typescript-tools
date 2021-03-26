declare module 'editorconfig' {
    /**
     * FileInfo
     * @desc Type representing file information
     */
    export interface FileInfo {
        indent_style?: string
        indent_size?: number
        tab_width?: number
        end_of_line?: string
        charset?: string
        trim_trailing_whitespace?: boolean
        insert_final_newline?: boolean
        root?: string
    }

    /**
     * ParseOptions
     * @desc Type representing parse options
     */
    export interface ParseOptions {
        config: string
        version: any // string or Version
    }

    export function parseFromFiles(filepath: string, files: any[], options?: ParseOptions): Promise<FileInfo>

    export function parse(filepath: string, options?: ParseOptions): Promise<FileInfo>
}
