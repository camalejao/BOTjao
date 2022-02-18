const axios = require('axios');

module.exports = {
    name: 'dog',
    aliases: ['cao', 'au', 'auau', 'cachorro'],
    description: 'Envia uma imagem de doguinho',
    category: 'images',
    async execute(message) {
        try {
            let req = await axios.get('https://dog.ceo/api/breeds/image/random');
            let url = req.data.message;
            message.channel.send('auau', { files: [url] });
        } catch (e) {
            console.log(e);
            message.channel.send('rip');
        }
    }
}