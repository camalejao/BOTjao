const { prefix } = require('../config.json');

module.exports = {
    name: 'help',
    aliases: ['ajuda', 'comandos', 'commands'],
    description: 'Lista os comandos disponíveis, ou dá detalhes sobre um comando',
    usage: '[nome de um comando]',
    optArgs: true,
    execute(message, options) {
        const args = options.args;
        const { commands } = message.client;

        if(args.length) {
            const cmd = commands.get(args[0])
                || commands.find(cmd => cmd.aliases && cmd.aliases.includes(args[0]));
            if(cmd) {
                let embed = {
                    title: `Comando ${prefix}${cmd.name}`,
                    color: 0x0099ff
                };

                let fields = [{ name: 'Descrição', value: cmd.description }];

                if(cmd.usage) {
                    fields.push({ name: 'Argumentos', value: cmd.usage });
                }
                if(cmd.aliases) {
                    let aliases = cmd.aliases.toString().split(',').join(', ');
                    fields.push({ name: 'Aliases', value: aliases });
                }
                let requirements = '';
                if(cmd.guildOnly) requirements += 'Comando de uso apenas em servidores. ';
                if(cmd.voice) requirements += 'Precisa estar em canal de voz.';
                if(requirements) fields.push({ name: 'Requerimentos', value: requirements });

                embed.fields = fields;

                return message.channel.send({ embed: embed });
            } else {
                let msg = 'comando não encontrado, use `';
                msg += `${prefix}` + 'help` para uma lista completa';
                return message.reply(msg);
            }
        } else {
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
    
            return message.channel.send({ embed: embed });
        }
    }
}