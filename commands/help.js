const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'comandos', 'commands'],
    description: 'Lista os comandos disponíveis',
    execute(message) {
        const { commands } = message.client;
        let embed = { 
            title: 'Lista de comandos do BOTjão',
            description: 'Use `' + prefix + 'help comando` para mais detalhes',
            color: 0x0099ff
        };
        let fields = [];
        let cmds = '';

        commands.filter(cmd => cmd.category === 'soundboard')
            .each(cmd => cmds += '`'+cmd.name+'` ');
        fields.push({ name: 'Voz/Soundboard', value: cmds, inline: true });
        
        cmds = '';
        commands.filter(cmd => cmd.category === 'images')
            .each(cmd => cmds += '`'+cmd.name+'` ');
        fields.push({ name: 'Imagens/Memes', value: cmds, inline: true });

        cmds = '';
        commands.filter(cmd => cmd.category === 'general')
            .each(cmd => cmds += '`'+cmd.name+'` ');
        fields.push({ name: 'Uso Geral', value: cmds });
        
        embed.fields = fields;

        message.channel.send({ embed: embed });
    }
}