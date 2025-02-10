export type TEmailSenderConfig = {
    enable: boolean
    host: string
    port: number
    secure: boolean
    auth: {
        user: string
        pass: string
    }
    default?: {
        from?: string
    }
}
