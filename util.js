const axios = require('axios');

module.exports = {
    getUserFromMention(mention) {
        if (!mention) return;

        if (mention.startsWith('<@') && mention.endsWith('>')) {
            mention = mention.slice(2, -1);

            if (mention.startsWith('!')) {
                mention = mention.slice(1);
            }

            return bot.users.cache.get(mention);
        }
    },
    async getImageFromSubreddit(url) {
        let imgUrl;
        await axios.get(url)
            .then(res => {
                const dist = res.data.data.dist;
                const posts = res.data.data.children;
                let n = Math.floor(Math.random() * dist);
                while (posts[n].data.post_hint != "image") {
                    n = Math.floor(Math.random() * dist);
                }
                imgUrl =  posts[n].data.url;
            })
            .catch(err => {
                console.log(err);
                imgUrl = false;
            });
        return imgUrl;
    }
}