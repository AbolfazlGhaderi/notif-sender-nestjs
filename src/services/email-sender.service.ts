import * as nodemailer from 'nodemailer'
import { concatMap, delay, from, mergeMap, Subject } from 'rxjs'
import { Injectable, Logger } from '@nestjs/common'
import { TEmailContent, TEmailSenderConfig } from '../types'

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
                mergeMap(async (email) => {
                    const isSuccess = await this.sendEmail(email);
                    if (!isSuccess) setTimeout(() => this.emailQueue.next(email), 5000);
                    await new Promise(resolve => setTimeout(resolve, 1000));

                }, 2)
            )
            .subscribe()
    }

    async sendEmail(emailContent: TEmailContent & { emailId: string })
    {
        // Log before sending email
        Logger.verbose(`<${emailContent.emailId}> Sending email to: ${emailContent.to}, Subject: ${emailContent.subject}`)
        if (this.options.enable)
        {
            try
            {
                await this.emailTransporter.sendMail({
                    from: this.options.defualt?.from || emailContent.from,
                    to: emailContent.to,
                    subject: emailContent.subject,
                    text: emailContent.text,
                    html: emailContent.html,
                })

                Logger.verbose(`<${emailContent.emailId}> Email sent successfully to: ${emailContent.to}`)

                return true
            }
            catch (error)
            {
                Logger.error(
                    `<${emailContent.emailId}> Failed to send email to: ${emailContent.to}, Error: ${(error as any)?.message || 'Unknown error'}`,
                )
                return false
            }
        }
        else
        {
            Logger.error(
                `<${emailContent.emailId}> Error: Email sender is disabled`,
            )
            return false
        }
    }

    sendEmail_addToQueue(emailContent: TEmailContent & { emailId: string })
    {
        this.emailQueue.next(emailContent)
    }
}
