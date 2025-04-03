# 🔔 Notif-Sender NestJS

Notif-Sender-NestJS is a notification service built for NestJS applications. It provides an easy way to send notifications via **Email** and **Telegram**, with built-in queue management using `RxJS` for better scalability.

## Features

- ✅ Send **Email** notifications using SMTP
- ✅ Send **Telegram** messages to a bot
- ✅ Built-in **queue management** using `RxJS`
- ✅ Designed for scalability and easy integration into NestJS projects
- ✅ Limit the maximum number of concurrent requests for sending notifications

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
                enable: boolean,
                host: 'string',
                port: number,
                secure: boolean,
                auth: {
                    user: 'string',
                    pass: '******',
                },
                default: {
                    from: 'string', // optional
                },
                maxConcurrentRequests: number // default is 2
            },
            telegramSenderConfig: {
                enable: boolean,
                botToken: 'string',
                chatId: 'string',
                maxConcurrentRequests: number // default is 2
            },
            logging: {
                enable: true // default is true!
            }
        }),
    ],
    controllers: [ AppController ],
    providers: [ AppService ],
})
export class AppModule {}
```

## 💎 Usage in Service

This service provides four methods for sending notifications via Telegram or email:

### 📧 Email :

💥 **sendNotifToEmail :**  Sends an email immediately. Use this when you need to ensure the email is sent before continuing execution.

🗃️ **sendNotifToEmail_addToQueue :**  Queues the email for later sending. This is useful when you don't need an immediate response and just want the email to be processed asynchronously.

### 📨 Telegram :

💥 **sendNotifToTelegram :** The `sendNotifToTelegram` method sends notifications directly to the chat ID configured during setup. However, you can also specify a different chat ID when calling this method.

⚠️ Important: Before sending a notification, the user must have already started a conversation with the bot; otherwise, the bot won't be able to send messages

⚠️ To send a message in a group or channel, the bot must be an admin!

🗃️ **sendNotifToTelegram_addToQueue :** This method works similarly to `sendNotifToTelegram`, but instead of sending the notification immediately, it adds it to a queue and sends it in order


Inject `NotifSenderService` into your service and send an email as follows:

```ts
import { NotifSenderService } from 'notif-sender-nestjs'

@Injectable()
export class AppService {
    constructor(private readonly notifService: NotifSenderService) {}

    async getHello()
    {
        // Send to email
        await this.notifService.sendNotifToEmail({
            subject: 'Hello',
            text: 'Hello World!',
            to: 'dev.ghaderi@gmail.com',
            html: '<p>Hello World!</p>',
            from: 'Abolfazl Ghaderi <abolfazlghaderi.ir>' // Optional - higher priority
        })

        // Send to telegram
        await this.notifService.sendNotifToTelegram({
            text: 'Hi mr.Brian',
            chatId: 'string', // Optional - higher priority
        })

        return 'Hello World!'
    }

    // OR

    getHello()
    {
        // Send to email
        this.notifService.sendNotifToEmail_addToQueue({
            subject: 'Hello',
            text: 'Hello World!',
            to: 'dev.ghaderi@gmail.com',
            html: '<p>Hello World!</p>',
            from: 'Abolfazl Ghaderi <abolfazlghaderi.ir>' // Optional - higher priority
        })

        // Send to telegram
        this.notifService.sendNotifToTelegram_addToQueue({
            text: 'Hi mr.Brian',
            chatId: 'string', // Optional - higher priority
        })

        return 'Hello World!'
    } 
}
```
## 🚀 Feedback & Contact  

Got any questions or suggestions? Feel free to reach out ❤️  

🌐 **Website:** [abolfazlghaderi.ir](https://abolfazlghaderi.ir)  
📩 **Email:** [dev.ghaderi@gmail.com](mailto:dev.ghaderi@gmail.com)  
💬 **Telegram:** [@Abolfazl_ghaderii](https://t.me/Abolfazl_ghaderii)  

Let's build something amazing together! ✨
