const util = require('../util.js');
const axios = require('axios');
const ytsr = require('ytsr');

module.exports = {
    name: 'album',
    description: 'Toca álbum do spotify',
    usage: 'link do álbum',
    args: true,
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    async execute(message, options) {
        let args = options.args;
        let albumId = args.join("").split("/").pop();

        if (albumId.includes('?')) {
            albumId = albumId.split('?')[0];
        }

        const token = await util.getSpotifyToken();
        
        let url = `https://api.spotify.com/v1/albums/${albumId}/tracks?offset=0&limit=50`;
        let opt = {headers: {'Authorization': `Bearer ${token}`}};

        const queries = await this.getSpotifyAlbumTracks(url, opt, []);

        let count = 0, errors = 0;
        const songs = [];
        await Promise.all(queries.map(async (query, idx) => {
            try {
                let song = {title: '', url: '', track: idx};
                
                let searchURL = 'https://www.youtube.com/results?search_query=';
                searchURL += `${encodeURIComponent(query)}&sp=EgIQAQ%253D%253D`;
                
                await ytsr(searchURL, {gl: 'BR', hl: 'pt', limit: 1})
                    .then(r => {
                        let items = r.items.filter(i => i.type === 'video');
                        song.title = items[0].title;
                        song.url = items[0].url;
                        songs.push(song);
                    }).catch(err => {
                        console.log(err);
                        errors += 1;
                    });

            } catch(err) { console.log(err); }
        }));
        songs.sort((a, b) => { return a.track - b.track });

        for(let s of songs) {
            options.queue.addToQueue(message.guild.id, s);
            count += 1;
        }

        message.channel.send(`${count} músicas adicionadas à fila`);
        if(errors > 0) {
            let msg = `Ocorreu erro em ${errors} caso(s) :(`
            message.channel.send(msg);
        }

        await message.member.voice.channel.join()
            .then(con => {
                options.queue.boundConnection(con,
                    message.channel, message.guild.id);
                options.queue.play(message.guild.id, false);
            });      
    },

    async getSpotifyAlbumTracks(url, options, items) {
        let next = true;
        while (next && items.length <= 200) {
            await axios.get(url, options)
                .then(({data}) => {
                    items = items.concat(data.items);

                    if(data.next != null && items.length <= 200) {
                        url = data.next;
                    } else {
                        next = false;
                    }
                })
                .catch(err => console.log(err));
        }
        return items.map(i => {
            let string = i.name + ' ';
            i.artists.forEach(a => { string += a.name + ' ' });
            return string;
        });
    }
}