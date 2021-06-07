module.exports = {
    name: 'queue',
    aliases: ['fila'],
    description: 'Retorna quantidade de músicas na fila',
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    execute(message, options) {
        options.queue.checkQueue(message.guild, message.channel);
    }
}