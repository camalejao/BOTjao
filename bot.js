// carregando a lib do discord
const Discord = require("discord.js");

// carregando a lib de música
const Music = require('discord.js-musicbot-addon');

// como "se referir" ao bot
const bot = new Discord.Client();

// carregando o arquivo com a configuração (prefix)
const config = require("./config.json");

// carregando o arquivo de mensagens
const mensagens = require("./mensagens.json");

// carregando o arquivo de soundboard
const soundboard = require("./soundboard.json");

// lib para requisições http
const request = require("request");


bot.on("ready", () => {
    // roda se o bot iniciado e logado com sucesso
    console.log(`Bot has started, with ${bot.users.size} users, in ${bot.channels.size} channels of ${bot.guilds.size} guilds.`);
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
        m.edit(`Pong! Latência de ${m.createdTimestamp - message.createdTimestamp}ms. Latência da API: ${Math.round(bot.ping)}ms`);
    }

    if (command === "oi") {
        // sorteia um número pseudoaleatório correspondente ao numero (de 1 a 10) de uma mensagem do arquivo de msgs
        var numero = Math.floor(Math.random() * 10 + 1).toString();
        // constrói a mensagem e menciona o usuário que enviou o comando
        const mensagem = mensagens[numero] + `<@${message.author.id}>`;
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
        var mensagem = "```Sound effects disponíveis:\n\n";
        
        for (var i = 0; i < soundboard.sounds.length; i++) {
            mensagem += soundboard.sounds[i].titulo + "\n";
        }

        mensagem += "\nPara dar play, use: jao!sound nomedosoundeffect\n```";
        message.channel.send(mensagem);
    }

    if (command === "sound") {

        const arg = args.join("");
        var url;

        if(arg===undefined){
            return message.reply("soundeffect não encontrado :(");
        }

        for (var i = 0; i < soundboard.sounds.length; i++) {
            if(arg === soundboard.sounds[i].titulo){
                url = soundboard.sounds[i].url;
            }
        }

        if(url===undefined){
            return message.reply("soundeffect não encontrado :(");
        }

        var voiceChannel = message.member.voiceChannel;
        if (!voiceChannel) {
            return message.reply("você precisa estar em um canal de voz >:(");
        }
        voiceChannel.join().then(connection => {
            const dispatcher = connection.playArbitraryInput(url);
            dispatcher.setVolume(1);
            dispatcher.on("end", end => {
                voiceChannel.leave();
            });
        }).catch(err => console.log(err));
    }
});


// configura addon de música
Music.start(bot, {
    prefix: config.prefix,                                      // Prefixo dos comandos
    global: false,                                              // queues espesificas para cada server
    youtubeKey: process.env.YT_API_KEY,                         // chave da API do YouTube
    maxQueueSize: 15,                                           // limita a queue em 15
    enableQueueStat: true,                                      // indicador playing/paused
    clearInvoker: true,                                         // apaga a mensagem de quem enviou o comando
    helpCmd: 'musica',                                          // nome para o comando 'help'
    playCmd: 'play',                                            // nome para o comando 'play'
    volumeCmd: 'adjust',                                        // nome para o comando 'volume'
    leaveCmd: 'quit',                                           // nome para o comando 'leave'
    disableLoop: true                                           // desativa o comando loop
});

bot.login(process.env.BOT_TOKEN);