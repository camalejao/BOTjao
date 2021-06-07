const util = require('../util.js');

module.exports = {
    name: 'dankmeme',
    aliases: ['dank', 'meme'],
    description: 'Pega um meme do subreddit /r/dankmemes',
    category: 'images',
    async execute(message) {
        const redditUrl = 'https://www.reddit.com/r/dankmemes/top/.json';
        const imgUrl = await util.getImageFromSubreddit(redditUrl);
        if(imgUrl) {
            return message.channel.send({ files: [imgUrl] });
        } else {
            return message.channel.send('Ocorreu um erro :(');
        }
    }
}