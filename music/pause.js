module.exports = {
    name: 'pause',
    description: 'Pausa música atual',
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    execute(message, options) {
        options.queue.pause(message.guild.id);
    }
}