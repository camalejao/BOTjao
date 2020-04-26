const DataBase = require('./database');
const db = new DataBase();
const msgs = db.getMensagens();

// Discord.js lib
const Discord = require("discord.js");

// bot client object
const bot = new Discord.Client();

const config = require("./config.json");
const mensagens = require("./mensagens.json");

// axios
const axios = require('axios');

bot.once("ready", () => {
    // roda se o bot iniciado e logado com sucesso
    console.log(`Bot has started, with ${bot.users.cache.size} users, in ${bot.channels.cache.size} channels of ${bot.guilds.cache.size} guilds.`);
    // muda o status de "jogando" do bot
    bot.user.setActivity('diga jao!help');
});

bot.on("guildCreate", guild => {
    // roda quando o bot entra num servidor
    console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
    bot.user.setActivity('diga jao!help');
});

bot.on("guildDelete", guild => {
    // roda quando o bot é removido de um servidor
    console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
    bot.user.setActivity('diga jao!help');
});



bot.on("message", async message => {
    // roda a cada mensagem recebida

    // ignora outros bots (e ele mesmo)
    if (message.author.bot) return;

    // ignora as mensagens que não começam com o prefixo do bot
    if (message.content.indexOf(config.prefix) !== 0) return;

    // separa os comandos dos argumentos dele
    // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
    // command = say
    // args = ["Is", "this", "the", "real", "life?"]
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();


    // comandos

    if (command === "say") {
        // faz o bot dizer alguma coisa
        // pega a "mensagem" juntando os aargumentos com espaços entre si
        const sayMessage = args.join(" ");
        // apaga a mensagem do comando; o catch ignora os erros
        message.delete().catch(O_o => { });
        // faz o bot enviar a mensagem
        message.channel.send(sayMessage);
    }

    if (command === "ping") {
        // Calculates ping between sending a message and editing it, giving a nice round-trip latency.
        // The second ping is an average latency between the bot and the websocket server (one-way, not round-trip)
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latência de ${m.createdTimestamp - message.createdTimestamp}ms. Latência da API: ${Math.round(bot.ws.ping)}ms`);
    }

    if (command === "oi") {
        // sorteia um número pseudoaleatório correspondente ao numero (de 1 a 10) de uma mensagem do arquivo de msgs
        var numero = Math.floor(Math.random() * 10 + 1);
        // constrói a mensagem e menciona o usuário que enviou o comando
        const mensagem = msgs[numero] + ` <@${message.author.id}>`;
        message.channel.send(mensagem);
    }

    if (command === "roger") {
        const mensagem = `HALP ROGER ME AJUDA`;
        message.channel.send(mensagem);
    }

    if (command === "help") {
        var mensagem = "```Lista de comandos:\n\n"; //começa a marcação do bloco de mensagem

        // percorre o array de comandos do arquivo de mensagens
        // constrói a mensagem adicionando em cada linha o prefixo + cada comando
        for (var i = 0; i < mensagens.comandos.length; i++) {
            mensagem += config.prefix + mensagens.comandos[i] + "\n";
        }

        mensagem += "\n```"; //termina a marcação do bloco de mensagem
        message.channel.send(mensagem);
    }

    if (command === "soundboard") {
        let mensagem = "```Sound effects disponíveis:\n\n";

        await db.getSoundBoard(message.guild.id)
            .then((sounds) => {
                sounds.forEach((sound) => {
                    mensagem += sound.titulo + '\n';
                });
            });

        mensagem += "\nPara dar play, use: jao!sound nomedosoundeffect\n```";
        message.channel.send(mensagem);
    }

    if (command === "sound") {
        console.log(new Date());
        const arg = args.join("");

        if (arg === undefined) {
            return message.reply("soundeffect não encontrado :(");
        }

        const url = await db.getSound(message.guild.id, arg)

        if (url === undefined) {
            return message.reply("soundeffect não encontrado :(");
        }

        const voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("você precisa estar em um canal de voz >:(");
        }
        voiceChannel.join().then(connection => {
            const dispatcher = connection.play(url);
            console.log(new Date());
            dispatcher.setVolume(1);
        }).catch(err => console.log(err));
    }

    if (command === "addsound") {

        const nome = args[0];
        const url = args[1];
        console.log(nome);
        console.log(url);
        //regex para validar url
        var pattern = new RegExp('(https?:\\/\\/)?[\\w\\-~]+(\\.[\\w\\-~]+)+(\\/[\\w\\-~]*)*(#[\\w\\-]*)?(\\?.*)?');

        if (!pattern.test(url)) {
            return message.reply("url inválida");
        }

        let result = await db.addSound(message.guild.id, nome, url);

        if(result)
            message.reply(nome + " adicionado");
        else
            message.reply("erro");
    }

    if (command === "gado") {
        try {
            const mensagem = `MUUUUUUUUUUUUU`;
            let key = process.env.PIXABAY_API_KEY;
            let req = await axios.get('https://pixabay.com/api/?key=' + key
                + '&q=ox+cow&category=animals&image_type=photo&pretty=true');
            let index = Math.floor(Math.random() * 20).toString();
            let url = req.data.hits[index].webformatURL;

            const imagem = [ url ];
            message.channel.send(mensagem, { files: imagem });
        } catch (err) {
            console.log(err);
            message.channel.send('rip');
        }
    }

    if (command === "cat") {
        try {
            let req = await axios.get('http://aws.random.cat/meow');
            let url = req.data.file.replace('\\', 'g');
            const imagem = [ url ];
            message.channel.send('miau', { files: imagem });
        } catch (e) {
            console.log(e);
            message.channel.send('rip');
        }
    }

    if (command === "carolina") {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("você precisa estar em um canal de voz >:(");
        }
        voiceChannel.join().then(connection => {
            const dispatcher = connection.play('https://www.myinstants.com/media/sounds/carolina.mp3');
            dispatcher.setVolume(1);
        }).catch(err => console.log(err));
    }

    if (command === "sair") {
        var voiceChannel = message.member.voice.channel;
        if (!voiceChannel) {
            return message.reply("você precisa estar em um canal de voz >:(");
        }
        if (message.member.hasPermission('MANAGE_CHANNELS'))
            voiceChannel.leave();
        else
            return message.reply("você precisa de um cargo com permissão para fazer isso :p");
    }

    if (command === "hipersonico") {
        var numero = Math.floor(Math.random() * 100 + 1).toString();
        const mensagem = `<@${message.author.id}> está ` + numero + `% Hipersônico`;
        message.channel.send(mensagem);
    }

    if (command === "safe") {
        var numero = Math.floor(Math.random() * 100 + 1).toString();
        const mensagem = `<@${message.author.id}> está ` + numero + `% Safe`;
        message.channel.send(mensagem);
    }

});

bot.login(process.env.BOT_TOKEN);