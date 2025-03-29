export type TEmailSenderConfig = {
    /**
     * Indicates whether the email sending service is enabled.
     * If `true`, the service will be active.
     */
    enable: boolean

    /**
     * The SMTP server address used to send emails (e.g., `sandbox.smtp.mailtrap.io`).
     */
    host: string

    /**
     * The port number used by the SMTP server (e.g., `465` or `587` or ...).
     */
    port: number

    /**
     * If `true`, a secure connection (SSL/TLS) will be used.
     */
    secure: boolean

    /**
     * Authentication information for connecting to the SMTP server.
     */
    auth: {
        /**
         * The username used to authenticate with the SMTP server.
         */
        user: string

        /**
         * The password or authentication token for the SMTP server.
         */
        pass: string
    }

    /**
     * Default email settings for sending messages.
     */
    default?: {
        /**
         * The default "from" address for sent emails.
         * If not set, the sender address must be specified manually.
         */
        from?: string
    }

    /**
     * The maximum number of concurrent email sending requests.
     * If not specified, the default value may be `2`.
     */
    maxConcurrentRequests?: number
}
