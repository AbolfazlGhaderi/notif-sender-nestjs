import { TEmailContent } from './types/email.content'

import { Inject, Injectable, Logger } from '@nestjs/common'
import { EmailSenderService } from './services/email-sender.service'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'

@Injectable()
export class NotifSenderService
{
    private emailSenderService: EmailSenderService | undefined

    constructor(@Inject('NOTIF_SENDER_OPTIONS') private options: INotifSenderOptions)
    {
        if (this.options.emailSenderConfig)
        {
            this.emailSenderService = new EmailSenderService(this.options.emailSenderConfig)
        }
    }

    async sendEmail(emailContent: TEmailContent)
    {
        const emailId = Math.floor(Math.random() * 1e8).toString()
        return this.emailSenderService?.sendEmail({ ...emailContent, emailId })
    }

    sendEmail_addToQueue(emailContent: TEmailContent)
    {
        const emailId = Math.floor(Math.random() * 1e8).toString()
        this.emailSenderService?.sendEmail_addToQueue({ ...emailContent, emailId })
    }
}
