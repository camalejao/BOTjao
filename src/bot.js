const Q = require('./queue.js');
const fs = require('fs');
const path = require('path');
const { prefix } = require('./config.json');

const util = require('./util.js');
const msgs = util.messages;

const queue = new Q();

const database = require('./database');

const Discord = require('discord.js');
const bot = new Discord.Client();
bot.commands = new Discord.Collection();

const commandFiles = fs.readdirSync(path.resolve(__dirname, './commands'))
    .filter(file => file.endsWith('.js'));
const soundboardFiles = fs.readdirSync(path.resolve(__dirname, './soundboard'))
    .filter(file => file.endsWith('.js'));
const musicFiles = fs.readdirSync(path.resolve(__dirname, './music'))
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	bot.commands.set(command.name, command);
}
for (const file of soundboardFiles) {
	const sbCommand = require(`./soundboard/${file}`);
	bot.commands.set(sbCommand.name, sbCommand);
}
for (const file of musicFiles) {
	const musicCommand = require(`./music/${file}`);
	bot.commands.set(musicCommand.name, musicCommand);
}

bot.once("ready", () => {
    console.log(`Bot iniciado: ${bot.users.cache.size} users, ${bot.channels.cache.size} canais, ${bot.guilds.cache.size} servers.`);
    bot.user.setActivity(`${prefix}help`);
});

bot.on("guildCreate", guild => {
    database.joinGuild(guild.id);
    console.log(`Adicionado a novo server: ${guild.name} (id: ${guild.id}), com ${guild.memberCount} membros`);
});

bot.on("guildDelete", guild => {
    database.leaveGuild(guild.id);
    console.log(`Removido do server: ${guild.name} (id: ${guild.id})`);
});

bot.on("message", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/g);

    const commandName = args.shift().toLowerCase();
    const command = bot.commands.get(commandName)
    || bot.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return;

    if ((command.guildOnly || command.voice) && message.channel.type !== 'text') {
		return message.reply('esse comando é exclusivo para servidores :c');
    }

    if(command.voice && (!message.member.voice.channel)) {
        return message.reply('você precisa estar em um canal de voz!');
    }

    if(command.permissions && !message.member.hasPermission(command.permissions)) {
        return message.reply('você não tem as permissões necessárias para executar esse comando!');
    }

    if (command.args && !args.length) {
		let reply = `Faltam argumentos para o comando, ${message.author}!`;
		if (command.usage) {
			reply += `\nO uso correto seria: \`${prefix}${command.name} ${command.usage}\``;
		}
		return message.channel.send(reply);
    }

    try {
        let options = {};
        if (command.args || command.optArgs) options.args = args;
        if (command.msgs) options.msgs = msgs;
        if (command.websocket) options.ws = bot.ws;
        if (command.database) options.db = database;
        if (command.mention) options.user = util.getUserFromMention(args[0], bot);
        if (command.music) options.queue = queue;

        command.execute(message, options);
        
	} catch (error) {
		console.error(error);
		message.reply('aconteceu um erro ao execudar o comando :c');
	}
});

/*
    Executa a cada intervalo de 5 minutos.
    Para cada conexão de voz, checa a quantidade de membros no canal.
    Se a quantidade de membros (não bots) for 0, disconecta.
*/
bot.setInterval(() => {
    bot.voice.connections.each(con => {
        if(con.channel.members.filter(m => m.user.bot === false).size === 0) {
            con.channel.leave();
            queue.clearQueue(con.channel.guild.id);
        }
    });
}, 300000, bot);

database.connect((err) => {
    if(err) console.log(err);
    bot.login(process.env.BOT_TOKEN);
});