// eslint-disable-next-line @typescript-eslint/no-var-requires,@typescript-eslint/no-require-imports
const execSync = require('child_process').execSync

export default {
    branch(): string {
        return execSync('git rev-parse --abbrev-ref HEAD || hg branch').toString().trim()
    },

    head(): string {
        return execSync("git log -1 --pretty=%H || hg id -i --debug | tr -d '+'").toString().trim()
    },
}
