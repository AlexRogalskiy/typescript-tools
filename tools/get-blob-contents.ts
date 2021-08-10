import execify from './execify'

// since we strip blobs, this ajax method fills it back in when needed
export async function getBlobContents(repoPath: string, hash: string): Promise<string> {
    return await execify(`git cat-file -p ${hash}`, repoPath)
}

// FRAGILE: similar to read-git-folder#unzipFile, TODO: centralize duplication
export async function getPackedHash(repoPath: string, hash: string): Promise<string | undefined> {
    try {
        return await execify(`git cat-file -t ${hash}`, repoPath)
    } catch (err) {
        // hash doesn't exist, likely a shallow clone
        return undefined
    }
}
