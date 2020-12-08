const axios = require('axios');
const querystring = require('querystring');

module.exports = {
    messages: [
        "salve ",
        "fala, meu consagrado ",
        "eae chegado ",
        "fala tu ",
        "opa meu suprassumo ",
        "fala ae meu inexorável ",
        "diz ae doidjo ",
        "opa meu patrão ",
        "oi bb ",
        "relou mai frend ",
        "coé "
    ],

    getUserFromMention(mention, bot) {
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
    },
    
    shuffleArray(arr) {
        arr.sort(() => Math.random() - 0.5)
    },

    async getSpotifyToken() {
        const base64 = Buffer.from(process.env.SPOTIFY_CLIENT + ':'
            + process.env.CLIENT_SECRET).toString('base64');
        try {
            let res = await axios({
                method: 'post',
                url: 'https://accounts.spotify.com/api/token',
                headers: {'Authorization': `Basic ${base64}`},
                data: querystring.stringify({grant_type: 'client_credentials'})
            });
            return res.data.access_token;
        } catch (err) {
            console.error(err);
        }
    },

    async getSpotifyPlaylistTracks(playlistId, token) {
        try {
            let res = await axios.get('https://api.spotify.com/v1/playlists/' + playlistId +
                '/tracks?fields=items(track(name, artists(name)))',
                {headers: {'Authorization': `Bearer ${token}`}});
            return res.data.items;
        } catch (err) {
            console.error(err);
        }
    },
    
}