import { TEmailSenderConfig, TLoggingConfig, TTelegramSenderConfig } from '../type'

export interface INotifSenderOptions {
    emailSenderConfig?: TEmailSenderConfig
    telegramSenderConfig?: TTelegramSenderConfig
    logging?: TLoggingConfig
}
