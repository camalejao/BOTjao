module.exports = {
    name: 'say',
    args: true,
    description: 'Digite uma mensagem e o BOTjão vai mandar ela no chat',
    usage: '[mensagem em texto]',
    category: 'general',
    execute(message, options) {
        let args = options.args;
        const msg = args.join(' ');
        message.delete().catch(err => console.log(err));
        message.channel.send(msg);
    }
}