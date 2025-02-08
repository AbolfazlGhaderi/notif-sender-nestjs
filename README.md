# 🔔 Notif-Sender NestJS

Notif-Sender-NestJS is a notification service built for NestJS applications. It provides an easy way to send notifications via **Email** and **Telegram**, with built-in queue management using `RxJS` for better scalability.

## Features

- ✅ Send **Email** notifications using SMTP
- ✅ Send **Telegram** messages to a bot
- ✅ Built-in **queue management** using `RxJS`
- ✅ Designed for scalability and easy integration into NestJS projects

## Queue Management with RxJS

Notif-Sender uses `RxJS` to queue and manage notifications, ensuring that messages are sent efficiently without blocking the main thread. This is useful for handling large volumes of notifications.

## 🪴 Usage

This example demonstrates how to use `notif-sender-nestjs` for sending emails in a NestJS application.

## 📥 Installation

Make sure you have installed the required package:

```sh
npm install notif-sender-nestjs
```
Or if you use `pnpm`:
```sh
pnpm add notif-sender-nestjs
```

## 🧑‍💻 Configuration

Import `NotifSenderModule` in your module and configure it as follows:

```ts
import { NotifSenderModule } from 'notif-sender-nestjs'

@Module({
    imports: [
        NotifSenderModule.register({
            emailSenderConfig: {
                enable: true,
                host: 'string',
                port: 465,
                secure: false,
                auth: {
                    user: 'string',
                    pass: '******',
                },
                defualt: {
                    from: 'Abolfazl Ghaderi <abolfazlghaderi.ir>', // optional
                },
            },
        }),
    ],
    controllers: [ AppController ],
    providers: [ AppService ],
})
export class AppModule {}
```

## 💎 Usage in Service

This service provides two methods for sending emails:

📨 **sendEmail_now :** Sends an email immediately. Use this when you need to ensure the email is sent before continuing execution.

📧 **sendEmail_addToQueue :** Queues the email for later sending. This is useful when you don't need an immediate response and just want the email to be processed asynchronously.

Inject `NotifSenderService` into your service and send an email as follows:

```ts
import { NotifSenderService } from 'notif-sender-nestjs'

@Injectable()
export class AppService {
    constructor(private readonly notifService: NotifSenderService) {}

    async getHello()
    {
        await this.notifService.sendEmail_now({
            subject: 'Hello',
            text: 'Hello World!',
            to: 'dev.ghaderi@gmail.com',
            html: '<p>Hello World!</p>'
        })

        return 'Hello World!'
    }

    // OR
    getHello()
    {
        this.notifService.sendEmail_addToQueue({
            subject: 'Hello',
            text: 'Hello World!',
            to: 'dev.ghaderi@gmail.com',
            html: '<p>Hello World!</p>'
        })

        return 'Hello World!'
    } 
}
```


## License

MIT License.
