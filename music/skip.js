module.exports = {
    name: 'skip',
    description: 'Passa faixa atual da fila de músicas',
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    execute(message, options) {
        options.queue.skip(message.guild.id);
    }
}