const axios = require('axios');

module.exports = {
    name: 'cat',
    aliases: ['miau', 'gato'],
    description: 'Envia uma imagem de gatinho',
    category: 'images',
    async execute(message) {
        try {
            let req = await axios.get('http://aws.random.cat/meow');
            let url = req.data.file.replace('\\', 'g');
            message.channel.send('miau', { files: [url] });
        } catch (e) {
            console.log(e);
            message.channel.send('rip');
        }
    }
}