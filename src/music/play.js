const ytsr = require('ytsr');
const ytdl = require('ytdl-core-discord');

const spotifyPlaylist = require('./spotify');
const spotifyAlbum = require('./album');
const ytPlaylist = require('./youtube');

module.exports = {
    name: 'play',
    aliases: ['p'],
    description: 'Toca música do youtube',
    usage: 'link do vídeo OU termo de busca',
    args: true,
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',

    async execute(message, options) {
        let url = options.args[0];
        console.log(url)
        
        const ytPlaylistMatches = url.match(/(?<=youtube.com\/playlist\?list=)([A-Za-z0-9-_]*)/);
        const spotifyPlaylistMatches = url.match(/(?<=spotify.com\/playlist\/)([A-Za-z0-9-_]*)/);
        const spotifyAlbumMatches = url.match(/(?<=spotify.com\/album\/)([A-Za-z0-9-_]*)/);

        if (ytPlaylistMatches) {
            ytPlaylist.execute(message, options);
        } else if (spotifyPlaylistMatches) {
            spotifyPlaylist.execute(message, options);
        } else if (spotifyAlbumMatches) {
            spotifyAlbum.execute(message, options);
        } else {
            this.play(message, options);
        }
    },

    async play(message, options) {
        let url = options.args[0];
        let query = options.args.join(' ');

        let song = {}, error = 0;

        if (ytdl.validateURL(url)) {
            await ytdl.getBasicInfo(url)
                .then(r => {
                    song.title = r.videoDetails.title;
                    song.url = r.videoDetails.video_url;
                }).catch(err => {
                    console.log(err);
                    error += 1;
                });
        } else {
            try {
                await ytsr(query, {gl: 'BR', hl: 'pt', limit: 1})
                    .then(r => {
                        let items = r.items.filter(i => i.type === 'video');
                        song.title = items[0].title;
                        song.url = items[0].url;
                    }).catch(err => {
                        console.log(err);
                        error += 1;
                    });
            } catch (err) { console.log(err) }
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