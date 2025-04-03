import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class LoggerService
{
    private logger = new Logger()

    constructor(private readonly options: { enable: boolean, context?: string }) {}

    private isEnable(): boolean
    {
        return this.options.enable
    }

    error(message: unknown, metadata: { satck? :string, context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.error(message, metadata.satck, this.options.context ?? metadata.context)
    }

    log(message: string, metadata: { context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.log(message, this.options.context ?? metadata.context)
    }

    warn(message: string, metadata: { context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.warn(message, this.options.context ?? metadata.context)
    }

    debug(message: string, metadata: { context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.debug(message, this.options.context ?? metadata.context)
    }

    verbose(message: string, metadata: { context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.verbose(message, this.options.context ?? metadata.context)
    }

    fatal(message: string, metadata: { context?: string } = {}): void
    {
        if (!this.isEnable()) return
        this.logger.fatal(`[FATAL] ${message}`, this.options.context ?? metadata.context)
    }
}