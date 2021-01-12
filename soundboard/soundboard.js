const { prefix } = require('../config.json');

module.exports = {
    name: 'soundboard',
    aliases: ['sb'],
    description: 'Lista os sound effects disponíveis na soundboard do servidor',
    database: true,
    guildOnly: true,
    category: 'soundboard',
    async execute(message, options) {
        const db = options.db;
        
        let sounds = [];
        await db.getSoundBoard(message.guild.id).then((sb) => sounds = sb);

        if(sounds.length) {
            let embed = {
                title: `Soundboard de ${message.guild.name}`,
                color: 0x0099ff,
                fields: []
            };

            let soundList = '';
            sounds.forEach(s => {
                if(soundList.length <= 1000)
                    soundList += '`' + s.title + '` • ';
            });
            soundList = soundList.slice(0, -3);

            embed.fields.push({
                name: 'Sound effects disponíveis',
                value: soundList
            });
            embed.fields.push({
                name: 'Como dar play',
                value: 'Use `' + prefix + 'sound nomedosoundeffect`'
            });

            message.channel.send({ embed: embed });
        } else {
            let m = 'A soundboard está vazia, use `' + prefix;
            m += 'help addsound` para saber como adicionar áudios';
            message.channel.send(m);
        }
    }
}