import * as nodemailer from 'nodemailer'
import { concatMap, delay, from, mergeMap, Subject } from 'rxjs'
import { Injectable, Logger } from '@nestjs/common'
import { TEmailContent, TEmailSenderConfig, TTelegramSenderConfig } from '../types'
import { TTelegramContent } from '../types/telegram-content'
import { EServices } from '../enums/services.enum'

@Injectable()
export class TelegramSenderService
{
    private chatId: string
    private botToken: string
    private messageQueue = new Subject<TTelegramContent & { messageId: string }>()

    constructor(private options: TTelegramSenderConfig)
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
                }, 2),
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
        Logger.verbose(`<${ messageId }> Sending message in telegram | ChatId: ${ chatId }`, EServices.TelegramSenderService)
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
                Logger.verbose(
                    `<${ messageId }> Message sent successfully to telegram | ChatId: ${ chatId }`,
                    EServices.TelegramSenderService,
                )
                return true
            }
            catch (error)
            {
                Logger.error(
                    `<${ messageId }> Message failed to send to Telegram | ChatId: ${ chatId } Error: ${ (error as any)?.message || 'Unknown error' }`,
                    EServices.TelegramSenderService,
                )
                return false
            }
        }
        else
        {
            Logger.error(`<${ messageId }> Error: Telegram sender is disable`, EServices.TelegramSenderService)
            return false
        }
    }

    sendNotifToTelegram_addToQueue(notifContent: TTelegramContent & { messageId: string })
    {
        this.messageQueue.next(notifContent)
    }
}
