const axios = require('axios');

module.exports = {
    name: 'gado',
    aliases: ['mu'],
    description: 'Envia a imagem de um gadão',
    async execute(message) {
        try {
            let key = process.env.PIXABAY_API_KEY;
            let req = await axios.get('https://pixabay.com/api/?key=' + key
                + '&q=ox+cow&category=animals&image_type=photo&pretty=true');
            let index = Math.floor(Math.random() * 20).toString();
            let url = req.data.hits[index].webformatURL;
            message.channel.send('MUUUUUUUUUUUUU', { files: [url] });
        } catch (err) {
            console.log(err);
            message.channel.send('rip');
        }
    }
}