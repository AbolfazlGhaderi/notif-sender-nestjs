import { DynamicModule, Module } from '@nestjs/common'
import { INotifSenderOptions } from './interfaces/notif-sender-module-options'
import { NotifSenderService } from './notif-sender.service'

@Module({})
export class NotifSenderModule
{
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
