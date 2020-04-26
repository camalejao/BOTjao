module.exports = {
    name: 'addsound',
    description: 'Adiciona um áudio na soundboard do servidor',
    usage: '<nome do sound effect> <url de alguma mídia de áudio>',
    args: true,
    database: true,
    guildOnly: true,
    async execute(message, options) {
        const db = options.db;
        let args = options.args;

        const title = args[0];
        const url = args[1];
        console.log(title);
        console.log(url);
        
        //regex para validar url
        let pattern = new RegExp('(https?:\\/\\/)?[\\w\\-~]+(\\.[\\w\\-~]+)+(\\/[\\w\\-~]*)*(#[\\w\\-]*)?(\\?.*)?');

        if (!pattern.test(url)) {
            return message.reply("url inválida");
        }

        let result = await db.addSound(message.guild.id, title, url);

        if(result)
            message.reply(title + " adicionado");
        else
            message.reply("erro");
    }
}