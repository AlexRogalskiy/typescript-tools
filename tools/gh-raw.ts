import ghParse from 'github-url-parse'

async function fetchRaw({ user, repo, ref, path }): Promise<any> {
    const response = await fetch(`https://raw.githubusercontent.com/${user}/${repo}/${ref}/${path}`)

    if (response.status >= 400) {
        return []
    }

    const raw = await response.text()
    return raw.split('\n').map((value, lineNumber) => ({ value, lineNumber: lineNumber + 1 }))
}

export default class Blob {
    // @ts-ignore
    private readonly el: string
    private readonly path: string
    private readonly branch: string
    private readonly type: 'diffLeft' | 'diffRight' | 'snippet' | 'full' | 'gist'
    private lines: { value: any; lineNumber: number }[]

    constructor({ el, path, lines, type, branch = '' }) {
        this.el = el
        this.path = path
        this.lines = lines
        this.branch = branch

        if (this.lines.length > 5000) {
            this.lines = this.lines.slice(0, 500)
        }

        this.type = type // one of: diffLeft, diffRight, snippet, full, gist
    }

    lineSelector(lineNumber): string {
        if (this.isDiff) {
            const side = this.type === 'diffLeft' ? 'L' : 'R'

            // The double selector is needed to avoid situations where the first line
            // is the chunk information like: @@ -0,0 +1 @@
            return `[id$='${side}${lineNumber}'][data-line-number='${lineNumber}']`
        }

        if (this.isSnippet) {
            return 'pre'
        }

        if (this.type === 'gist') {
            return `[id$='LC${lineNumber}']`
        }

        return `#LC${lineNumber}`
    }

    get isDiff(): boolean {
        return ['diffLeft', 'diffRight'].includes(this.type)
    }

    get isSnippet(): boolean {
        return this.type === 'snippet'
    }

    toString(): string {
        return this.lines.map(({ value }) => value).join('\n')
    }

    get firstLineNumber(): number {
        return this.lines[0].lineNumber
    }

    toJSON(): any {
        try {
            return JSON.parse(this.toString())
        } catch (err) {
            return {}
        }
    }

    async fetchBlob(): Promise<void> {
        const { user, repo, branch, path } = ghParse(`https://github.com${this.path}`)
        this.lines = await fetchRaw({
            user,
            repo,
            ref: this.branch || branch, // this.branch is given when type is diffLeft
            path,
        })
    }
}
