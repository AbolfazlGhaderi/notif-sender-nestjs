# 🔔 Notif-Sender NestJS

Notif-Sender-NestJS is a notification service built for NestJS applications. It provides an easy way to send notifications via **Email** and **Telegram**, with built-in queue management using `RxJS` for better scalability.

## Features

- ✅ Send **Email** notifications using SMTP
- ✅ Send **Telegram** messages to a bot
- ✅ Built-in **queue management** using `RxJS`
- ✅ Designed for scalability and easy integration into NestJS projects

## Installation

```sh
npm install notif-sender-nestjs
```
Or if you use `pnpm`:
```sh
pnpm add notif-sender-nestjs
```

## Queue Management with RxJS

Notif-Sender uses `RxJS` to queue and manage notifications, ensuring that messages are sent efficiently without blocking the main thread. This is useful for handling large volumes of notifications.


## License

MIT License.
