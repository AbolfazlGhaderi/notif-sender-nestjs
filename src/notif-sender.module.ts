import { DynamicModule, Module } from '@nestjs/common'
import { NotifSenderService } from './notif-sender.service'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'

@Module({})
export class NotifSenderModule
{
    /**
     * Registers the NotifSenderModule with the given configuration options.
     * This method returns a dynamic module that can be imported into other modules.
     * 
     * @param {INotifSenderOptions} options - The configuration options for the notification sender.
     * @returns {DynamicModule} The dynamic module containing the NotifSenderService.
     * 
     * @example
     *{
            emailSenderConfig: {
                enable: true,
                host: 'sandbox.smtp.mailtrap.io',
                port: 2525,
                secure: false,
                auth: {
                    user: 'username',
                    pass: '***********',
                },
                maxConcurrentRequests: 2
            },
            telegramSenderConfig: {
                enable: true,
                botToken: 'TOKEN',
                chatId: 'ID',
                maxConcurrentRequests: 1
            }
        }
     */
    static register(options: INotifSenderOptions): DynamicModule
    {
        return {
            module: NotifSenderModule,
            providers: [
                {
                    provide: 'NOTIF_SENDER_OPTIONS',
                    useValue: options,
                },
                NotifSenderService,
            ],
            exports: [ NotifSenderService ],
        }
    }
}
