import { mergeMap, Subject } from 'rxjs'
import { Injectable } from '@nestjs/common'
import { LoggerService } from './logger.service'
import { EServices } from '../enums/services.enum'
import { LoggingConfigInOption, TTelegramContent, TTelegramSenderConfig } from '../type'

@Injectable()
export class TelegramSenderService
{
    private chatId: string
    private botToken: string
    private messageQueue = new Subject<TTelegramContent & { messageId: string }>()
    private logger = new LoggerService({
        enable: this.options.logging.enable,
        context: EServices.TelegramSenderService,
    })

    constructor(private options: TTelegramSenderConfig & LoggingConfigInOption)
    {
        this.chatId = this.options.chatId
        this.botToken = this.options.botToken

        this.messageQueue
            .pipe(
                mergeMap(async (notif) =>
                {
                    const isSuccess = await this.sendNotifToTelegram(notif)
                    if (!isSuccess) setTimeout(() => this.messageQueue.next(notif), 5000)
                    await new Promise((resolve) => setTimeout(resolve, 1000))
                }, this.options.maxConcurrentRequests || 2),
            )
            .subscribe()
    }

    getUrl(botToken: string)
    {
        return `https://api.telegram.org/bot${botToken}/sendMessage`
    }

    async sendNotifToTelegram(notifContent: TTelegramContent & { messageId: string })
    {
        const chatId = notifContent.chatId ?? this.options.chatId
        const messageId = notifContent.messageId

        this.logger.verbose(`<${ messageId }> Sending message in telegram | ChatId: ${ chatId }`)
        if (this.options.enable)
        {
            try
            {
                const data = {
                    chat_id: chatId,
                    text: notifContent.text,
                }
                const response = await fetch(this.getUrl(this.botToken), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data),
                })
                const result = await response.json()
                if (!result?.ok)
                {
                    throw new Error(`${ result?.description || 'Unknown error' } | ErrorCode: ${ result?.error_code || 'Unknown code' }`)
                }
                this.logger.verbose(
                    `<${ messageId }> Message sent successfully to telegram | ChatId: ${ chatId }`)
                return true
            }
            catch (error)
            {
                this.logger.error(
                    `<${ messageId }> Message failed to send to Telegram | ChatId: ${ chatId } Error: ${ (error as any)?.message || 'Unknown error' }`)
                return false
            }
        }
        else
        {
            this.logger.error(`<${ messageId }> Error: Telegram sender is disable`)
            return false
        }
    }

    sendNotifToTelegram_addToQueue(notifContent: TTelegramContent & { messageId: string })
    {
        this.messageQueue.next(notifContent)
    }
}
