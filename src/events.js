let fs
const fetch = require('node-fetch');
let ipList = {}

function ping(ip, config){
    if(!fs) fs = require("fs");
    if (!fs.existsSync(`./data/`)) fs.mkdirSync(`./data/`);
    if (!fs.existsSync(`./data/pings.json`)){
        notify(ip, config)
        fs.writeFileSync(`./data/pings.json`, JSON.stringify({ips: [ip], log: [{ip: ip, time: Date.now()}]}, null, 2));
        return
    }

    try{
        let raw = fs.readFileSync(`./data/pings.json`)
        let data = JSON.parse(raw)

        if(!data.ips.includes(ip)){
            notify(ip, config)
            data.ips.push(ip)
        }

        data.log.push({ip: ip, time: Date.now()})

        fs.writeFileSync(`./data/pings.json`, JSON.stringify(data, null, 2))
    } catch(err){
        console.log(err);
    }
}


function join(name, ip, client, config){
    notifyJoin(ip, name, client, config)
    if(!fs) fs = require("fs");
    if (!fs.existsSync(`./data/`)) fs.mkdirSync(`./data/`);
    if (!fs.existsSync(`./data/joins.json`)) return fs.writeFileSync(`./data/joins.json`, JSON.stringify({names: [name], log: [{name: name, ip: ip, time: Date.now()}]}, null, 2));

    try{
        let raw = fs.readFileSync(`./data/joins.json`)
        let data = JSON.parse(raw)

        if(!data.names.includes(name)) data.names.push(name)
        data.log.push({name: name, ip: ip, time: Date.now()})

        fs.writeFileSync(`./data/joins.json`, JSON.stringify(data, null, 2))
    } catch(err){
        console.log(err);
    }
}


function notify(ip, config) {
    fetch(
        config.webhookUrl,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // the username to be displayed
            username: 'Honeypot',
            // the avatar to be displayed
            avatar_url: config.webhookIconUrl,
            // enable mentioning of individual users or roles, but not @everyone/@here
            // embeds to be sent
            embeds: [
              {
                // decimal number colour of the side of the embed
                color: 11730954,
                // embed title
                // - link on 2nd row
                title: `${"Server Pinged by New IP"}`,
                // embed description
                // - text on 3rd row
                description: `${`IP: \`${ip}\``}`,
              },
            ],
          }),
        }
      )
}

function notifyJoin(ip, name, client, config) {
  fetch(
      config.webhookUrl,
      {
        method: 'post',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          // the username to be displayed
          username: 'Honeypot',
          // the avatar to be displayed
          avatar_url: config.webhookIconUrl,
          // enable mentioning of individual users or roles, but not @everyone/@here
          // embeds to be sent
          embeds: [
            {
              // decimal number colour of the side of the embed
              color: 11730954,
              // embed title
              // - link on 2nd row
              title: `${"Player Joined"}`,
              // embed description
              // - text on 3rd row
              description: `${`Username: \`${name}\`\nUUID: \`${client.uuid}\`\nIP: \`${ip}\``}`,
            },
          ],
        }),
      }
    )
}


function report(config) {
    if(!fs) fs = require("fs");
    if (!fs.existsSync(`./data/`)) return;
    if (!fs.existsSync(`./data/pings.json`)) return;
    let reportStr = "**IP & Ping Count**\n"

    try{
        let raw = fs.readFileSync(`./data/pings.json`)
        let data = JSON.parse(raw)

        data.ips.forEach(ip => {
            ipList[ip] = 0;
        });

        data.log.forEach(log => {
            ipList[log.ip]++
        })

        data.ips.forEach(async ip => {

            let raw = await fetch(`https://ipinfo.io/${ip}/json?token=${config.ipInfoToken}`)
            let data = await raw.json()
            let isp

            try{
                if(!data || data.error || !data.org) {
                    isp = "None."
                } else {
                    isp = data.org
                }
            } catch(err){isp = "Error"}

            reportStr += `\`${ip}\` | \`${isp}\` | Count: ${ipList[ip]}\n`

        });
        setTimeout(() => {
            sendWs(reportStr, config);
        },3000)
        

    } catch(err){
        console.log(err);
    }

}


function sendWs(reportStr, config) {
    console.log(reportStr)
    fetch(
        config.webhookUrl,
        {
          method: 'post',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            // the username to be displayed
            username: 'Honeypot',
            // the avatar to be displayed
            avatar_url: config.webhookIconUrl,
            // enable mentioning of individual users or roles, but not @everyone/@here
            // embeds to be sent
            embeds: [
              {
                // decimal number colour of the side of the embed
                color: 11730954,
                // embed title
                // - link on 2nd row
                title: `6 HOUR REPORT`,
                // embed description
                // - text on 3rd row
                description: reportStr,
              },
            ],
          }),
        }
      )
}


module.exports = {ping, join, report}