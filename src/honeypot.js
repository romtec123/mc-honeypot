let mc = require("minecraft-protocol")
const logger = require("./logger")
const event = require('./events')


let server
let startTime

function start(config){
    startTime = Date.now();

    //Create a server
    server = mc.createServer({
        'online-mode': true,   
        encryption: true,
        host: '0.0.0.0',
        port: config.port,
        version: config.version,
        favicon: config.custIcon ?? "",
        maxPlayers: config.playerCount
    });

    server.on('connection', async function (newProxyClient) {
        logger.log(`${newProxyClient.protocolState} from IP: ${newProxyClient.socket.remoteAddress}`, "INFO")
        event.ping(newProxyClient.socket.remoteAddress, config)
    })

    server.on('login', async function (newProxyClient) {
        event.join(newProxyClient.username, newProxyClient.socket.remoteAddress, newProxyClient, config)
        logger.log(`Validated Session from IP: [${newProxyClient.socket.remoteAddress}] Username: [${newProxyClient.username}] UUID: [${newProxyClient.uuid}] protocol-version: [${newProxyClient.protocolVersion}]`, "INFO")
        newProxyClient.on('end', (reason) => {
            logger.log(`${newProxyClient.username} client disconnected.`, "INFO")
            return;
        })
        newProxyClient.end("You are not whitelisted on this server!")
    });

}

function setMOTD(motd) {
    if(motd) server.motd = motd;
}



module.exports = { start, setMOTD}