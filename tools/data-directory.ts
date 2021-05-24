import path from 'path'
import { homedir } from 'os'

/**
 * getAppDataDir returns the data directory for an Electron app,
 * it is equivalent to the app.getPath('userData') API in Electron.
 * https://www.electronjs.org/docs/api/app#appgetpathname
 */
export function getAppDataDir(app: string): string {
    if (process.platform === 'darwin') {
        return path.join(homedir(), 'Library', 'Application Support', app)
    } else if (process.platform === 'win32') {
        return path.join(process.env.APPDATA || path.join(homedir(), 'AppData', 'Roaming'), app)
    } else if (process.platform === 'linux') {
        return path.join(process.env.XDG_DATA_HOME || path.join(homedir(), '.config'), app)
    }
    return ''
}
