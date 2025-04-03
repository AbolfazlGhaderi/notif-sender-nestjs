import { Inject, Injectable } from '@nestjs/common'
import { TEmailContent, TTelegramContent } from './type'
import { EmailSenderService } from './services/email-sender.service'
import { TelegramSenderService } from './services/telegram-sender.service'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'

@Injectable()
export class NotifSenderService
{
    private emailSenderService: EmailSenderService | undefined
    private telegramSenderService: TelegramSenderService | undefined

    constructor(@Inject('NOTIF_SENDER_OPTIONS') private options: INotifSenderOptions)
    {
        if (this.options.emailSenderConfig)
        {
            this.emailSenderService = new EmailSenderService({
                ...this.options.emailSenderConfig,
                logging: {
                    enable: this.options.logging?.enable ?? true, // defualt is true
                },
            })
        }
        if (this.options.telegramSenderConfig)
        {
            this.telegramSenderService = new TelegramSenderService({
                ...this.options.telegramSenderConfig,
                logging: {
                    enable: this.options.logging?.enable ?? true, // defualt is true
                },
            })
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
