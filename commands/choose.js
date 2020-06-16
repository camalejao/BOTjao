module.exports = {
    name: 'choose',
    aliases: ['choice', 'escolher', 'escolha'],
    description: 'Escolhe uma das opções informadas pelo usuário',
    usage: 'opção 1; opção 2; opção 3; ... ; opção N\n(o \';\' é usado para separar as opções)',
    args: true,
    category: 'general',
    execute(message, options) {
        let opts = options.args.join(' ').split(';').filter(String).map((e) => {return e.trim();});
        let choosen = opts[Math.floor(Math.random() * opts.length)];
        message.channel.send('A opção escolhida foi `' + choosen + '`!');
    }
}