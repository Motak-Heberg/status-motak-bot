const tcpp = require('tcp-ping');
const {Client, MessageEmbed, Discord} = require('discord.js');
const config = require("./server/server.json");
const bot = new Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });

bot.login(process.env.TOKEN);

bot.on('ready', () => {
    console.log(`Logged in as ${bot.user.tag}!`);

    let addr = process.env.IP_DOMAIN,
    port = process.env.PORT;
    
    bot.channels.cache.get(process.env.CHANNEL_ID).messages.fetch(process.env.MESSAGE_ID)
    .then(msg => {
        setInterval(() => {
            tcpp.probe(addr, port, function(err, available) {
                if (available) {
                    tcpp.ping({ address: addr, port: port}, function(err, data) {
                        let ping = new MessageEmbed()
                        .setTitle(`Nos Serveurs :`)
                        .setColor(`GREEN`)
                        if (Math.floor(data.avg) < 1000){
                            ping.addField(`${process.env.SERVER_NAME}`, "✔️ En ligne - " + Math.floor(data.avg) + ` ms`)
                        } else {
                            ping.addField(`${process.env.SERVER_NAME}`, "❌ Hors Ligne - ~ ms")
                        }
                        ping.addField(`\u200B`, `\u200B`)
                        ping.setFooter(`Dernière actualisation ${new Date().toLocaleString("fr-FR", {timeZone: "Europe/Paris"}).split(',')[0]} | powered by https://motak.fr`)
                        msg.edit(ping)  
                        bot.user.setPresence({ activity: { name: `${process.env.SERVER_NAME} : ${Math.floor(data.avg)} ms`}, status: 'dnd'});
                    })
                }
            });
        }, 5000)
    });
});

