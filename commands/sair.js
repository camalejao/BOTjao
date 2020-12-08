module.exports = {
    name: 'sair',
    description: 'Faz o BOTjão sair do canal de voz',
    voice: true,
    guildOnly: true,
    permissions: ['MANAGE_CHANNELS'],
    category: 'soundboard',
    music: true,
    execute(message, options) {
        message.member.voice.channel.leave();
        options.queue.clearQueue(message.guild.id);
    }
}