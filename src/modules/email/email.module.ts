import { EmailService } from './email.service'
import { DynamicModule, Module } from '@nestjs/common'
import { EmailModuleOptions } from '../../interfaces/email.interface'

@Module({})
export class EmailModule
{
    static register(options: EmailModuleOptions): DynamicModule
    {
        return {
            module: EmailModule,
            providers: [
                {
                    provide: 'EMAIL_OPTIONS',
                    useValue: options,
                },
                EmailService,
            ],
            exports: [ EmailService ],
        }
    }
}
