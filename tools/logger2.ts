import * as FS from 'fs'

const LOG_FILE = process.env.LOG_TO_FILE

module.exports = (file: string): any => {
    return {
        isDebug() {
            return !!process.env.DEBUG
        },
        debug(msg) {
            if (!this.isDebug()) {
                return
            }

            if (LOG_FILE) {
                FS.appendFile(LOG_FILE, `${new Date()} - ${file} - [DEBUG] - ${msg}\n`)
            } else {
                console.log('%s: %s', file, msg)
            }
        },
        log(msg) {
            if (LOG_FILE) {
                FS.appendFile(LOG_FILE, `${new Date()} - ${file} - [INFO] - ${msg}\n`)
            } else {
                console.log('%s: %s', file, msg)
            }
        },
        error(msg) {
            if (LOG_FILE) {
                FS.appendFile(LOG_FILE, `${new Date()} - ${file} - [ERROR] - ${msg}\n`)
            } else {
                console.error('%s: %s', file, msg)
            }
        },
        warn(msg) {
            if (LOG_FILE) {
                FS.appendFile(LOG_FILE, `${new Date()} - ${file} - [WARNING] - ${msg}\n`)
            } else {
                console.warn('%s: %s', file, msg)
            }
        },
    }
}
