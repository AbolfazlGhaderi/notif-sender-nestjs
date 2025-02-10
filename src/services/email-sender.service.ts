import * as nodemailer from 'nodemailer'
import { concatMap, delay, from, mergeMap, Subject } from 'rxjs'
import { Injectable, Logger } from '@nestjs/common'
import { TEmailContent, TEmailSenderConfig } from '../types'
import { EServices } from '../enums/services.enum'

@Injectable()
export class EmailSenderService
{
    private emailTransporter: nodemailer.Transporter
    private emailQueue = new Subject<TEmailContent & { emailId: string }>()

    constructor(private options: TEmailSenderConfig)
    {
        this.emailTransporter = nodemailer.createTransport({
            host: this.options.host,
            port: this.options.port,
            secure: this.options.secure,
            auth: this.options.auth,
            from: this.options.defualt?.from,
        })

        this.emailQueue
            .pipe(
                mergeMap(async (notif) =>
                {
                    const isSuccess = await this.sendNotifToEmail(notif)
                    if (!isSuccess) setTimeout(() => this.emailQueue.next(notif), 5000)
                    await new Promise(resolve => setTimeout(resolve, 1000))

                }, 2),
            )
            .subscribe()
    }

    async sendNotifToEmail(notifContent: TEmailContent & { emailId: string })
    {
        // Log before sending email
        Logger.verbose(`<${notifContent.emailId}> Sending email to: ${notifContent.to}, Subject: ${notifContent.subject}`, EServices.EmailSenderService)
        if (this.options.enable)
        {
            try
            {
                await this.emailTransporter.sendMail({
                    from: this.options.defualt?.from || notifContent.from,
                    to: notifContent.to,
                    subject: notifContent.subject,
                    text: notifContent.text,
                    html: notifContent.html,
                })

                Logger.verbose(`<${notifContent.emailId}> Email sent successfully to: ${notifContent.to}`, EServices.EmailSenderService)

                return true
            }
            catch (error)
            {
                Logger.error(
                    `<${notifContent.emailId}> Failed to send email to: ${notifContent.to}, Error: ${(error as any)?.message || 'Unknown error'}`, EServices.EmailSenderService,
                )
                return false
            }
        }
        else
        {
            Logger.error(
                `<${notifContent.emailId}> Error: Email sender is disable`, EServices.EmailSenderService,
            )
            return false
        }
    }

    sendNotifToEmail_addToQueue(notifContent: TEmailContent & { emailId: string })
    {
        this.emailQueue.next(notifContent)
    }
}
