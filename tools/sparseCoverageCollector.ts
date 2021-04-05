export class SparseCoverageCollector {
    private readonly srcCoverage
    private readonly metaInfo

    constructor() {
        this.srcCoverage = {}
        this.metaInfo = {}
    }

    getSourceCoverage(filename: string): any {
        let data = this.srcCoverage[filename]
        if (!data) {
            data = this.srcCoverage[filename] = {
                path: filename,
                statementMap: {},
                fnMap: {},
                branchMap: {},
                s: {},
                b: {},
                f: {},
            }
            this.metaInfo[filename] = {
                indexes: {},
                lastIndex: {
                    s: 0,
                    b: 0,
                    f: 0,
                },
            }
        }

        return {
            data,
            meta: this.metaInfo[filename],
        }
    }

    setCoverage(filePath: string, fileCoverage: any): void {
        this.srcCoverage[filePath] = fileCoverage
    }

    setSourceCode(filePath: string, source: any): void {
        this.getSourceCoverage(filePath).data.code = source
    }

    getFinalCoverage(): any {
        return this.srcCoverage
    }

    updateBranch(source: any, srcItem: any, hits: any[]): void {
        const { data, meta } = this.getSourceCoverage(source)

        const keys = ['b']
        srcItem.locations.map(loc => keys.push(loc.start.line, loc.start.column, loc.end.line, loc.end.line))

        const k = keys.join(':')

        let index = meta.indexes[k]
        if (!index) {
            meta.lastIndex.b += 1
            index = meta.lastIndex.b
            meta.indexes[k] = index
            data.branchMap[index] = srcItem
        }

        if (!data.b[index]) {
            data.b[index] = hits.map(v => v)
        } else {
            for (let i = 0; i < hits.length; i += 1) {
                data.b[index][i] += hits[i]
            }
        }
    }

    updateFunction(source: any, srcItem: any, hits: any[]): void {
        const { data, meta } = this.getSourceCoverage(source)

        const key = [
            'f',
            srcItem.loc.start.line,
            srcItem.loc.start.column,
            srcItem.loc.end.line,
            srcItem.loc.end.column,
        ].join(':')

        let index = meta.indexes[key]
        if (!index) {
            meta.lastIndex.f += 1
            index = meta.lastIndex.f
            meta.indexes[key] = index
            data.fnMap[index] = srcItem
        }

        data.f[index] = data.f[index] || 0
        data.f[index] += hits
    }

    updateStatement(source: any, srcItem: any, hits: any[]): void {
        const { data, meta } = this.getSourceCoverage(source)

        const key = [
            's',
            srcItem.start.line,
            srcItem.start.column,
            srcItem.end.line,
            srcItem.end.column,
        ].join(':')

        let index = meta.indexes[key]
        if (!index) {
            meta.lastIndex.s += 1
            index = meta.lastIndex.s
            meta.indexes[key] = index
            data.statementMap[index] = srcItem
        }

        data.s[index] = data.s[index] || 0
        data.s[index] += hits
    }
}
