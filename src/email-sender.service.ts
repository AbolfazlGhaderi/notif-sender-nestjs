import * as nodemailer from 'nodemailer'
import { TEmailContent, TEmailSenderConfig } from './types'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { concatMap, delay, from, Subject, tap } from 'rxjs'

@Injectable()
export class EmailSenderService
{
    private emailTransporter: nodemailer.Transporter
    private emailQueue = new Subject<TEmailContent>()

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
                concatMap((email) =>
                {
                    const emailId = Math.floor(Math.random() * 1e8)
                    // Log before sending email
                    Logger.verbose(
                        `<${emailId}> Sending email to: ${email.to}, Subject: ${email.subject}`,
                    )

                    return from(this.sendEmail_now(email)).pipe(
                        tap(() =>
                        {
                            // Log after email is sent
                            Logger.verbose(
                                `<${emailId}> Email sent to: ${email.to}, Subject: ${email.subject}`,
                            )
                        }),
                    )
                }), // Send each email after the previous one is finished
                delay(20), // Delay between each email
            )
            .subscribe()
    }

    async sendEmail_now(emailContent: TEmailContent)
    {
        if (this.options.enable)
        {
            return this.emailTransporter.sendMail({
                from: this.options.defualt?.from || emailContent.from,
                to: emailContent.to,
                subject: emailContent.subject,
                text: emailContent.text,
                html: emailContent.html,
            })
        }
    }

    sendEmail_addToQueue(emailContent: TEmailContent)
    {
        this.emailQueue.next(emailContent)
    }
}
