import * as nodemailer from 'nodemailer'
import { TEmailContent } from '../../types/email.content'
import { Inject, Injectable, Logger } from '@nestjs/common'
import { concatMap, delay, from, Subject, tap } from 'rxjs'
import { EmailModuleOptions } from '../../interfaces/email.interface'

@Injectable()
export class EmailService
{
    private transporter: nodemailer.Transporter

    private queue$ = new Subject<TEmailContent>()

    constructor(@Inject('EMAIL_OPTIONS') private options: EmailModuleOptions)
    {
        this.transporter = nodemailer.createTransport({
            host: this.options.host,
            port: this.options.port,
            secure: this.options.secure,
            auth: this.options.auth,
            from: this.options.defualt?.from,
        })

        this.queue$
            .pipe(
                concatMap((email) =>
                {
                    const emailId = Math.floor(Math.random() * 1e8)
                    // Log before sending email
                    Logger.verbose(`<${emailId}> Sending email to: ${email.to}, Subject: ${email.subject}`)

                    return from(this.sendEmail_now(email)).pipe(
                        tap(() =>
                        {
                            // Log after email is sent
                            Logger.verbose(`<${emailId}> Email sent to: ${email.to}, Subject: ${email.subject}`)
                        }),
                    )
                }), // Send each email after the previous one is finished
                delay(20), // Delay between each email
            )
            .subscribe()
    }

    async sendEmail_now(emailContent: TEmailContent)
    {
        return this.transporter.sendMail({
            from: this.options.defualt?.from || emailContent.from,
            to: emailContent.to,
            subject: emailContent.subject,
            text: emailContent.body,
            html: emailContent.body,
        })
    }

    sendEmail_addToQueue(emailContent: TEmailContent)
    {
        this.queue$.next(emailContent)
    }
}
