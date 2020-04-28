module.exports = {
    name: 'safe',
    description: 'Mostra quantos % safe você (ou quem vc mencionar) está no momento',
    usage: '[menção opcional a um usuario]',
    mention: true,
    category: 'general',
    execute(message, options) {
        const user = options.user;
        let msg;
        let n = Math.floor(Math.random() * 100 + 1).toString();
        if(user)
            msg = `<@${user.id}> está ${n}% safe`;
        else
            msg = `${message.author} está ${n}% safe`;
        message.channel.send(msg);
    }
}