const util = require('../../util');
const axios = require('axios');
const ytsr = require('ytsr');

module.exports = {
    async execute(message, options) {
        
        let args = options.args;
        let trackId = args.join("").split("/").pop();

        if (trackId.includes('?')) {
            trackId = trackId.split('?')[0];
        }

        const token = await util.getSpotifyToken();

        let url = `https://api.spotify.com/v1/tracks/${trackId}`;
        let opt = {headers: {'Authorization': `Bearer ${token}`}};

        let song = {title: '', url: ''}, error = 0;
        
        try {
            const { data } = await axios.get(url, opt);
            const query = data.name;
            console.log(query);

            let searchURL = 'https://www.youtube.com/results?search_query=';
            searchURL += `${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
                
            await ytsr(searchURL, util.getYtsrSearchOptions())
                .then(r => {
                    let items = r.items.filter(i => i.type === 'video');
                    song.title = items[0].title;
                    song.url = items[0].url;
                }).catch(err => { error += 1; throw err });

        } catch (err) {
            console.log(err);
            message.channel.send('deu erro :c');
        }

        if (!error) {
            options.queue.addToQueue(message.guild.id, song);
            message.channel.send(song.title + ' adicionada à fila');
            await message.member.voice.channel.join()
                .then(con => {
                    options.queue.boundConnection(con,
                        message.channel, message.guild.id);
                    options.queue.play(message.guild.id, false);
                });
        } else {
            message.channel.send('deu erro :c');
        }
    }
}