module.exports = {
    name: 'sound',
    description: 'Toca um áudio da soundboard',
    usage: '[nome do sound effect]',
    database: true,
    args: true,
    voice: true,
    guildOnly: true,
    category: 'soundboard',
    async execute(message, options) {
        const db = options.db;
        let args = options.args;

        const arg = args.join("");

        if (arg === undefined) {
            return message.reply("soundeffect não encontrado :(");
        }

        const url = await db.getSound(message.guild.id, arg)

        if (url === undefined) {
            return message.reply("soundeffect não encontrado :(");
        }

        message.member.voice.channel.join().then(connection => {
            const dispatcher = connection.play(url);
            console.log(new Date());
            dispatcher.setVolume(1);
        }).catch(err => console.log(err));
    }
}