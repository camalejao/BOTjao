const util = require('../util.js');

module.exports = {
    name: 'monke',
    aliases: ['macaco', 'ape'],
    description: 'Rejeite a humanidade, retorne a macaco (memes do r/ape e r/monke)',
    category: 'images',

    async execute(message) {
        const urls = [
            'https://www.reddit.com/r/ape/top/.json',
            'https://www.reddit.com/r/monke/top/.json'
        ];
        let n = Math.floor(Math.random() * 2);
        const imgUrl = await util.getImageFromSubreddit(urls[n]);
        if (imgUrl) {
            return message.channel.send('Rejeite a humanidade, retorne a macaco',
                { files: [imgUrl] });
        } else {
            return message.channel.send('Ocorreu um erro :(');
        }
    },
}