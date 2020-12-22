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
            let msg = "```Sound effects disponíveis:\n\n";
            sounds.forEach((sound) => msg += sound.title + '\n');
            msg += "\nPara dar play, use: " + prefix + "sound nomedosoundeffect\n```";
            message.channel.send(msg);
        } else {
            let m = 'A soundboard está vazia, use `' + prefix;
            m += 'help addsound` para saber como adicionar áudios';
            message.channel.send(m);
        }
    }
}