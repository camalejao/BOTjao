module.exports = {
    name: 'resume',
    description: 'Continua música atual',
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    execute(message, options) {
        options.queue.resume(message.guild.id);
    }
}