module.exports = {
    name: 'oi',
    aliases: ['hello'],
    description: 'Saudações',
    msgs: true,
    category: 'general',
    execute(message, options) {
        const msgs = options.msgs;
        let idx = Math.floor(Math.random() * 9);
        const m = msgs[idx] + ` <@${message.author.id}>`;
        message.channel.send(m);
    }
}