require('dotenv').config()
const Discord = require("discord.js");

const modules = {
    buscape: require("./src/modules/buscape.js"),
    zoom: require("./src/modules/zoom.js")
}

function filterArgs(args) {
    let term = "";
    for (const element of args)
        term += element + ' '
    return term;
}

function responseToCoolText(response) {
    let responseText = "Veja o que eu encontrei: \n";
    for (const item of response)
        responseText += ` 🎁 ${item.name} (${item.url}) \n 💸 ${item.price}\n\n`

    return responseText
}

const prefix = "!!";

const errorMessage = `🙁 DESCULPE MAS NÃO ENCONTREI NADA COM ESSE TERMO! TENTE NOVAMENTE POR FAVOR`
const client = new Discord.Client();

client.login(process.env.DISCORD_TOKEN);

client.on("message", async function (message) {
    try {

        // Elimina verificação de msg de bots
        if (message.author.bot) return;

        // Elimina verificação de msg que nao contem o nosso prefixo
        if (!message.content.startsWith(prefix)) return;

        const commandBody = message.content.slice(prefix.length);
        const args = commandBody.split(' ');
        const command = args.shift().toLowerCase();

        if (command === "findzoom") {
            await message.reply('Ok! Buscando ofertas no zoom ⏳ Aguarde por favor ⏳');
            let term = filterArgs(args)
            let zoom = await modules.zoom(term)
            if (zoom.length > 0) {
                // Utilizando o splice para nao exceder  limite de caracterres
                let response = responseToCoolText(zoom.splice(0, 5))
                await message.reply(response);
            }
            else {
                await message.reply(errorMessage);
            }
        }
        else if (command === "findbuscape") {
            await message.reply('Ok! Buscando ofertas no buscape ⏳ Aguarde por favor ⏳');
            let term = filterArgs(args)
            let buscape = await modules.buscape(term)
            if (buscape.length > 0) {
                // Utilizando o splice para nao exceder  limite de caracterres
                let response = responseToCoolText(zoom.splice(0, 5))
                await message.reply(response);
            }
            else {
                await message.reply(errorMessage);
            }
        }
        else if (command === "findall") {
            await message.reply('Ok! ⏳ Aguarde por favor ⏳');
            let term = filterArgs(args)
            let buscape = await modules.buscape(term)
            let zoom = await modules.zoom(term)
            // Utilizando o splice para nao exceder  limite de caracterres
            let total = zoom.splice(0,2).concat(buscape.splice(0,1))
            if (total.length > 0) {
                let response = responseToCoolText(total)
                await message.reply(response);
            }
            else {
                await message.reply(errorMessage);
            }
        }
        else {
            await message.reply('😢 OPS! Comando invalido! tente !!findzoom, findbuscape ou findall');
        }

    } catch (err) {
      
        await message.reply('😢 OPS! Ocorreu um erro, tente novamente');
    }
});
