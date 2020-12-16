const util = require('../util.js');
const ytsr = require('ytsr');
const ytdl = require('ytdl-core');

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
        let query = options.args.join(' ');

        let song = {};

        if (ytdl.validateURL(url)) {
            const r = await ytdl.getBasicInfo(url);
            
            song.title = r.videoDetails.title;
            song.url = r.videoDetails.video_url;
        } else {
            try {
                const r = await ytsr(query, {limit: 1});
                if (r.items[1]) {
                    song.title = r.items[1].title;
                    song.url = r.items[1].link;
                } else {
                    song.title = r.items[0].title;
                    song.url = r.items[0].link;
                }
            } catch (err) { console.log(err) }
        }
        
        options.queue.addToQueue(message.guild.id, song);
        message.channel.send(song.title + ' adicionada à fila');

        const con = await message.member.voice.channel.join();
        options.queue.boundConnection(con, message.channel, message.guild.id);
        options.queue.play(message.guild.id, false);
    }
}