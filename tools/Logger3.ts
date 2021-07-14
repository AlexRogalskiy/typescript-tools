import { format } from 'util'

type LogLevel = 'debug' | 'error' | 'info' | 'warn'

interface InnerLogger {
    log(level: LogLevel, message: string): void
}

class ConsoleLogger implements InnerLogger {
    log(level: string, message: string): void {
        console[level](message)
    }
}

export class Logger3 {
    _innerLogger: InnerLogger
    _prefix: string

    constructor({ logger, prefix }: { logger?: InnerLogger; prefix?: string } = {}) {
        this._innerLogger = logger || new ConsoleLogger()
        this._prefix = prefix || ''
    }

    _format(args: any[]): string {
        const argsToFormat = this._prefix ? [this._prefix, ...args] : args
        return (format as any)(...argsToFormat)
    }

    alert(...args: any[]): void {
        this._innerLogger.log('error', this._format(['critical', ...args]))
    }

    debug(...args: any[]): void {
        this._innerLogger.log('debug', this._format(args))
    }

    error(...args: any[]): void {
        this._innerLogger.log('error', this._format(args))
    }

    info(...args: any[]): void {
        this._innerLogger.log('info', this._format(args))
    }

    prefix(prefix: string): Logger3 {
        return new Logger3({ logger: this._innerLogger, prefix })
    }

    warn(...args: any[]): void {
        this._innerLogger.log('warn', this._format(args))
    }
}
