import { TEmailSenderConfig } from '../types/email-sender-config.type'
import { TTelegramSenderConfig } from '../types/telegram-sender-config.type'

export interface INotifSenderOptions {
    emailSenderConfig?: TEmailSenderConfig
    telegramSenderConfig?: TTelegramSenderConfig
}
