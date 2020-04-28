const util = require('../util.js');

module.exports = {
    name: 'jojoke',
    aliases: ['jojo'],
    description: 'Pega um meme do subreddit /r/ShitPostCrusaders',
    async execute(message) {
        const redditUrl = 'https://www.reddit.com/r/shitpostcrusaders/top/.json';
        const imgUrl = await util.getImageFromSubreddit(redditUrl);
        if(imgUrl) {
            return message.channel.send({ files: [imgUrl] });
        } else {
            return message.channel.send('Ocorreu um erro :(');
        }
    }
}