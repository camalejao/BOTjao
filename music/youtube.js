const util = require('../util.js');
const axios = require('axios');
const ytdl = require('ytdl-core');

module.exports = {
    name: 'youtube',
    aliases: ['yt'],
    description: 'Toca playlist do youtube',
    usage: 'linkdaplaylist',
    args: true,
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',

    async execute(message, options) {
        let args = options.args.join("");
        if(!args.includes('playlist?list=')) {
            let msg = 'url inválida. Só funciona com o formato ';
            msg += 'www.youtube.com/playlist?list=idDaPlaylist';
            message.reply(msg);
            return;
        }

        const playlistId = args.split("=").pop();

        let baseUrl = 'https://www.googleapis.com/youtube/v3/playlistItems/';
        baseUrl += '?part=contentDetails&playlistId=';

        let url = `${baseUrl}${playlistId}&maxResults=50&key=${process.env.YT_API_KEY}`;

        let items = [];
        items = await this.reqs(url, items);
        util.shuffleArray(items);

        let count = 0;
        await Promise.all(items.map(async (item) => {
            let query = 'http://www.youtube.com/watch?v=' + item.contentDetails.videoId;
            try {
                const r = await ytdl.getBasicInfo(query);
                let song = {
                    title: r.videoDetails.title,
                    url: r.videoDetails.video_url
                };
                options.queue.addToQueue(message.guild.id, song);
                count += 1;
            } catch(err) { console.log(err) }
        }));
        message.channel.send(count + ' músicas adicionadas à fila');

        const con = await message.member.voice.channel.join();
        options.queue.boundConnection(con, message.channel, message.guild.id);
        options.queue.play(message.guild.id, false);
    },

    async reqs(url, items) {
        let npt = true;
        while (npt && items.length <= 200) {
            await axios.get(url)
                .then(({data}) => {
                    items = items.concat(data.items);
                    if(data.nextPageToken && items.length <= 200) {
                        url += '&pageToken=' + data.nextPageToken;
                    } else {
                        npt = false;
                    }
                });
        }
        return items;
    }
}
