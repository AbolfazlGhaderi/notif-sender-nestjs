import { Inject, Injectable } from '@nestjs/common'
import * as nodemailer from 'nodemailer'
import { EmailModuleOptions } from '../../interfaces/email.interface'

@Injectable()
export class EmailService
{
  private transporter: nodemailer.Transporter

  constructor(@Inject('EMAIL_OPTIONS') private options: EmailModuleOptions)
  {
      this.transporter = nodemailer.createTransport({
          host: this.options.host,
          port: this.options.port,
          secure: this.options.secure,
          auth: this.options.auth,
          from: this.options.defualt?.from,
      })
  }

  async sendMail(to: string, subject: string, text: string, html?: string, from?: string)
  {
      return this.transporter.sendMail({
          from: this.options.defualt?.from || from,
          to,
          subject,
          text,
          html,
      })
  }
}
