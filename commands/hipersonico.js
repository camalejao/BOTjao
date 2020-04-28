module.exports = {
    name: 'hipersonico',
    description: 'Mostra o seu nível (ou de quem vc mencionar) de hipersônico no momento',
    usage: '[menção opcional a um usuario]',
    mention: true,
    category: 'general',
    execute(message, options) {
        const user = options.user;
        let msg;
        let n = Math.floor(Math.random() * 100 + 1).toString();
        if(user)
            msg = `<@${user.id}> está ${n}% Hipersônico`;
        else
            msg = `${message.author} está ${n}% Hipersônico`;
        message.channel.send(msg);
    }
}