import * as nodemailer from 'nodemailer'
import { mergeMap, Subject } from 'rxjs'
import { EServices } from '../enums/services.enum'
import { Injectable, Logger } from '@nestjs/common'
import { TEmailContent, TEmailSenderConfig } from '../types'

@Injectable()
export class EmailSenderService
{
    private emailTransporter: nodemailer.Transporter
    private emailQueue = new Subject<TEmailContent & { emailId: string }>()
    private logger = new Logger(EServices.EmailSenderService)

    constructor(private options: TEmailSenderConfig)
    {
        this.emailTransporter = nodemailer.createTransport({
            host: this.options.host,
            port: this.options.port,
            secure: this.options.secure,
            auth: this.options.auth,
            from: this.options.default?.from,
        })

        this.emailQueue
            .pipe(
                mergeMap(async (notif) =>
                {
                    const isSuccess = await this.sendNotifToEmail(notif)
                    if (!isSuccess) setTimeout(() => this.emailQueue.next(notif), 5000)
                    await new Promise(resolve => setTimeout(resolve, 1000))

                }, this.options.maxConcurrentRequests || 2),
            )
            .subscribe()
    }

    async sendNotifToEmail(notifContent: TEmailContent & { emailId: string })
    {
        // Log before sending email
        this.logger.verbose(`<${notifContent.emailId}> Sending email to: ${notifContent.to}, Subject: ${notifContent.subject}`)
        if (this.options.enable)
        {
            try
            {
                await this.emailTransporter.sendMail({
                    from: this.options.default?.from || notifContent.from,
                    to: notifContent.to,
                    subject: notifContent.subject,
                    text: notifContent.text,
                    html: notifContent.html,
                })

                this.logger.verbose(`<${notifContent.emailId}> Email sent successfully to: ${notifContent.to}`)

                return true
            }
            catch (error)
            {
                this.logger.error(
                    `<${notifContent.emailId}> Failed to send email to: ${notifContent.to}, Error: ${(error as any)?.message || 'Unknown error'}`,
                )
                return false
            }
        }
        else
        {
            this.logger.error(
                `<${notifContent.emailId}> Error: Email sender is disable`,
            )
            return false
        }
    }

    sendNotifToEmail_addToQueue(notifContent: TEmailContent & { emailId: string })
    {
        this.emailQueue.next(notifContent)
    }
}
