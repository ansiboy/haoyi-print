declare type UserConfig = {
    defaultPrinter?: string,
    port: number,
    hostname: string,
    enableInnerPrintService: boolean,
}

declare type ApplicationConfig = {
    productName: string,
    templatePath: string,
}

declare type PrintConfig = {
    userConfig: UserConfig,
    applicationConfig: ApplicationConfig
}