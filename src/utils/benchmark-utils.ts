import { mkdirSync, writeFileSync } from 'fs'
import { tmpdir } from 'os'
import { join } from 'path'

export namespace Benchmarks {
    export const getRandomId = (): string => {
        return Math.random().toString().slice(2)
    }

    export const getRandomInt = (min: number, max: number): number => {
        const diff = max - min
        return Math.floor(Math.random() * diff) + min
    }

    export const getRandomText = (wordCount: number): string => {
        return Array.from({ length: wordCount }).map(getRandomId).join(' ')
    }

    export const getRandomFileData = (): string => {
        const wordCount = getRandomInt(1000, 2000)
        return getRandomText(wordCount)
    }

    export const createRandomFile = (dir): void => {
        const fileName = `${getRandomId()}.txt`
        const data = getRandomFileData()
        writeFileSync(join(dir, fileName), data, 'utf8')
    }

    export const createRandomProject = (dir, fileCount): void => {
        const nowJson = JSON.stringify({ version: 2, public: true, name: 'test' }, null, ' ')
        writeFileSync(join(dir, 'now.json'), nowJson, 'utf8')
        const publicDir = join(dir, 'public')
        mkdirSync(publicDir)
        // eslint-disable-next-line github/array-foreach
        Array.from({ length: fileCount }).forEach(() => createRandomFile(publicDir))
    }

    export const timeTrack = (fileCount = 1000): void => {
        const randomTmpId = getRandomId()
        const dir = join(tmpdir(), `now-benchmark${randomTmpId}`)
        console.log(`Creating ${dir} with ${fileCount} random files...`)
        mkdirSync(dir)
        createRandomProject(dir, Number(fileCount))
        console.log('Done. Run the following:')
        console.log(`cd ${dir}`)
        console.log('time vercel --no-clipboard')
    }
}
