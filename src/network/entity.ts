import { PassThrough } from 'stream'

export namespace File {
    export type FileData = NodeFileData | BrowserFileData

    export interface NodeFileData {
        body: PassThrough
        url: string
        filename: string
    }

    export interface BrowserFileData {
        body: any
        url: string
        blob?: () => Promise<Blob>
    }
}
