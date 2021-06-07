const util = require('../util.js');

module.exports = {
    name: 'animeme',
    aliases: ['animemes'],
    description: 'Pega um meme do subreddit /r/Animemes',
    category: 'images',
    async execute(message) {
        const redditUrl = 'https://www.reddit.com/r/animemes/top/.json';
        const imgUrl = await util.getImageFromSubreddit(redditUrl);
        if(imgUrl) {
            return message.channel.send({ files: [imgUrl] });
        } else {
            return message.channel.send('Ocorreu um erro :(');
        }
    }
}