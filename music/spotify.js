const util = require('../util.js');
const ytsr = require('ytsr');

module.exports = {
    name: 'spotify',
    description: 'Toca playlist do spotify',
    usage: 'linkdaplaylist',
    args: true,
    voice: true,
    guildOnly: true,
    music: true,
    category: 'music',
    async execute(message, options) {
        let args = options.args;
        const playlistId = args.join("").split("/").pop();

        const token = await util.getSpotifyToken();
        
        const tracks = await util.getSpotifyPlaylistTracks(playlistId, token);
        console.log(token)
        console.log(tracks)

        const queries = [];
        tracks.forEach(t => {
            let string = t.track.name + ' ';
            t.track.artists.forEach(a => { string += a.name + ' ' })
            queries.push(string);
        });
        util.shuffleArray(queries);

        //const gq = options.queue.getQueue(message.guild.id);

        let count = 0;
        await Promise.all(queries.map(async (query) => {
            console.log(query)
            try {
                const r = await ytsr(query, {limit: 1});
                if(r.items[1]) {
                    song = {title: r.items[1].title, url: r.items[1].link}
                    options.queue.addToQueue(message.guild.id, song);
                } else {
                    song = {title: r.items[0].title, url: r.items[0].link}
                    options.queue.addToQueue(message.guild.id, song);
                }
                count += 1;
            } catch(err) { console.log(err) }
        }));
        message.channel.send(count + ' músicas adicionadas à fila');

        const con = await message.member.voice.channel.join();
        options.queue.boundConnection(con, message.channel, message.guild.id);
        options.queue.play(message.guild.id, false);
    },

}