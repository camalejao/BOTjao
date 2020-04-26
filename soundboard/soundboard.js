module.exports = {
    name: 'soundboard',
    description: 'Lista os sound effects disponíveis na soundboard do servidor',
    database: true,
    guildOnly: true,
    async execute(message, options) {
        const db = options.db;

        let msg = "```Sound effects disponíveis:\n\n";

        await db.getSoundBoard(message.guild.id)
            .then((sounds) => {
                sounds.forEach((sound) => {
                    msg += sound.titulo + '\n';
                });
            });

        msg += "\nPara dar play, use: jao!sound nomedosoundeffect\n```";
        message.channel.send(msg);
    }
}