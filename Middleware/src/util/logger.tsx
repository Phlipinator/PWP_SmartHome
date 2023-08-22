// Logger class that can log info, debug, warning and error messages in different colors
export class Logger {
    private static defaultColor = '\x1b[37m'
    private static mqttColor = '\x1b[33m'
    private static expressColor = '\x1b[34m'
    private static errorColor = '\x1b[31m'

    public static log(prefix: string, color: string = this.defaultColor, ...data: any[]) {
        console.log(`${color}[${prefix}] ${data.join(' ')}\x1b[0m`)
    }

    public static debug(...data: any[]) {
        this.log('DEBUG', this.defaultColor, data)
    }

    public static mqtt(...data: any[]) {
        this.log('MQTT', this.mqttColor, data)
    }

    public static express(...data: any[]) {
        this.log('EXPRESS', this.expressColor, data)
    }

    public static error(...data: any[]) {
        this.log('ERROR', this.errorColor, data)
    }
}
