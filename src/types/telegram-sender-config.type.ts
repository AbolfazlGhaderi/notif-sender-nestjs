export type TTelegramSenderConfig = {
    /**
     * Indicates whether the Telegram notification service is enabled.
     * If `true`, the service will be active.
     */
    enable: boolean

    /**
     * The bot token provided by the Telegram Bot API.
     * This token is used to authenticate the bot.
     */
    botToken: string

    /**
     * The chat ID where messages will be sent.
     * This can be a user ID or a group/channel ID.
     */
    chatId: string

    /**
     * The maximum number of concurrent message sending requests.
     * If not specified, the default value may be `2`.
     */
    maxConcurrentRequests?: number
}
