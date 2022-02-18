const util = require('../util');

const ytsr = require('ytsr');
const ytdl = require('ytdl-core-discord');

const spotifyPlaylist = require('./services/spotify');
const spotifyAlbum = require('./services/album');
const spotifyTrack = require('./services/track');
const ytPlaylist = require('./services/youtube');

module.exports = {
    name: 'play',
    aliases: ['p', 'yt', 'youtube', 'spotify', 'album', 'musica', 'music'],
    description: 'Comando para tocar músicas. Pode ser um vídeo/playlist do youtube ou um álbum/música/playlist do spotify.',
    usage: 'Você pode mandar o link de um vídeo ou playlist do youtube, ou então o link de um álbum/música/playlist do spotify. Se não mandar um link, a mensagem que você enviar será pesquisada no youtube, e será tocado o primeiro resultado encontrado.',
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
        const spotifyTrackMatches = url.match(/(?<=spotify.com\/track\/)([A-Za-z0-9-_]*)/);

        if (ytPlaylistMatches) {
            ytPlaylist.execute(message, options);
        } else if (spotifyPlaylistMatches) {
            spotifyPlaylist.execute(message, options);
        } else if (spotifyAlbumMatches) {
            spotifyAlbum.execute(message, options);
        } else if (spotifyTrackMatches) {
            spotifyTrack.execute(message, options);
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
                await ytsr(query, util.getYtsrSearchOptions())
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