import { TEmailContent } from './types/email.content'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { EmailSenderService } from './services/email-sender.service'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'
import { TTelegramContent } from './types/telegram-content'
import { TelegramSenderService } from './services/telegram-sender.service'

@Injectable()
export class NotifSenderService
{
    private emailSenderService: EmailSenderService | undefined
    private telegramSenderService: TelegramSenderService | undefined

    constructor(@Inject('NOTIF_SENDER_OPTIONS') private options: INotifSenderOptions)
    {
        if (this.options.emailSenderConfig)
        {
            this.emailSenderService = new EmailSenderService(this.options.emailSenderConfig)
        }
        if (this.options.telegramSenderConfig)
        {
            this.telegramSenderService = new TelegramSenderService(this.options.telegramSenderConfig)
        }
    }

    async sendNotifToEmail(notifContent: TEmailContent)
    {
        const emailId = Math.floor(Math.random() * 1e8).toString()
        return this.emailSenderService?.sendNotifToEmail({ ...notifContent, emailId })
    }

    sendNotifToEmail_addToQueue(notifContent: TEmailContent)
    {
        const emailId = Math.floor(Math.random() * 1e8).toString()
        this.emailSenderService?.sendNotifToEmail_addToQueue({ ...notifContent, emailId })
    }

    async sendNotifToTelegram(notifContent: TTelegramContent)
    {
        const messageId = Math.floor(Math.random() * 1e8).toString()
        return this.telegramSenderService?.sendNotifToTelegram({ ...notifContent, messageId })
    }

    sendNotifToTelegram_addToQueue(notifContent: TTelegramContent)
    {
        const messageId = Math.floor(Math.random() * 1e8).toString()
        this.telegramSenderService?.sendNotifToTelegram_addToQueue({ ...notifContent, messageId })
    }
}
