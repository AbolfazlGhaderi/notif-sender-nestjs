import * as nodemailer from 'nodemailer'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { concatMap, delay, from, Subject, tap } from 'rxjs'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'
import { TEmailContent } from './types/email.content'
import { EmailSenderService } from './email-sender.service'

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

    async sendEmail_now(emailContent: TEmailContent)
    {
        return this.emailSenderService?.sendEmail_now(emailContent)
    }

    sendEmail_addToQueue(emailContent: TEmailContent)
    {
        this.emailSenderService?.sendEmail_addToQueue(emailContent)
    }
}
