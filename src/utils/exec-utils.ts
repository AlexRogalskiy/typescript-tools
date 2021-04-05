import _ from 'lodash'

import * as shell from 'shelljs'
import { join } from 'path'

import { Optional } from '../../typings/standard-types'

import { Errors, Files } from '..'

export namespace ExecUtils {
    import valueError = Errors.valueError
    export const execToJson = (command = 'npm show quicktype versions --json'): string => {
        return JSON.parse(exec(command))
    }

    export const exec = (command: string, options = { silent: true }): string => {
        const result = shell.exec(command, options)

        return (result.stdout as string).trim()
    }

    export const installDeps = (): void => {
        const result = shell.exec('npm install --ignore-scripts')
        if (result.code !== 0) {
            process.exit(result.code)
        }
    }

    export const makeDistributedCLIExecutable = (
        destDir = 'dist',
        scriptPrefix = '#!/usr/bin/env node\n',
    ): void => {
        const cli = join(destDir, 'cli', 'index.js')

        Files.mapFile(cli, cli, content => {
            if (_.startsWith(content, scriptPrefix)) return content
            return scriptPrefix + content
        })

        shell.chmod('+x', cli)
    }

    export async function execAsync(
        s: string,
        opts: { silent: boolean },
    ): Promise<{ stdout: string; code: number }> {
        return new Promise<{ stdout: string; code: number }>((resolve, reject) => {
            shell.exec(s, opts, (code, stdout, stderr) => {
                if (code !== 0) {
                    console.error(stdout)
                    console.error(stderr)
                    reject(valueError('Unsupported exec command', { command: s, code }))
                }
                resolve({ stdout, code })
            })
        })
    }

    export const CURRENT_VERSION = (matcher = /quicktype: '(.+)'/): Optional<string> => {
        const version = exec('npm version')
        const match = version.match(matcher)

        return match && match[1]
    }
}
