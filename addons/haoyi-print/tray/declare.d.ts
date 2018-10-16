declare type UserConfig = {
    defaultPrinter?: string,
    port: number,
    hostname: string,
    enableInnerPrintService: boolean,
}

declare type ApplicationConfig = {
    productName: string,
}

declare type PrintConfig = {
    userConfig: UserConfig,
    applicationConfig: ApplicationConfig
}