module.exports = {
    name: 'sair',
    description: 'Faz o BOTjão sair do canal de voz',
    voice: true,
    guildOnly: true,
    permissions: ['MANAGE_CHANNELS'],
    category: 'soundboard',
    execute(message) {
        message.member.voice.channel.leave();
    }
}