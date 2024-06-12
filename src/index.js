const events = require("./events")
const logger = require("./logger")
const honeypot = require('./honeypot')
const cfg = require("./configHelper")

const defaultConfig = {
    port: 25565,
    custMotd: "A Minecraft Server",
    playerCount: 20,
    custIcon: "data:image/png;base64,", // Icon must be a png encoded in base64
    webhookUrl: "",
    webhookIconUrl: "",
    version: "1.20.1",
    ipInfoToken: ""
}

async function main() {
    const config = await cfg.getConfig("config", defaultConfig)


    logger.log(`Starting server:\nPORT: ${config.port}\nMOTD: ${config.custMotd}` , "INFO")

    honeypot.start(config)

    //generate report
    events.report(config)
    setInterval(() => {
        events.report(config)
    }, 21600000)

}
main()