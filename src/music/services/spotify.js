const util = require('../../util');
const ytsr = require('ytsr');

module.exports = {

    async execute(message, options) {
        let args = options.args;
        let playlistId = args.join("").split("/").pop();

        if (playlistId.includes('?')) {
            playlistId = playlistId.split('?')[0];
        }

        try {
            const token = await util.getSpotifyToken();
            const tracks = await util.getSpotifyPlaylistTracks(playlistId, token);
    
            const queries = [];
            tracks.forEach(t => {
                let string = t.track.name + ' ';
                t.track.artists.forEach(a => { string += a.name + ' ' })
                queries.push(string);
            });
            util.shuffleArray(queries);
        
            /*
                too many async/await and promises and callbacks and try/catches
                oh ffs i just dont want it to crash for some dumb reason
                (which is obviously my fault)
            */
            let count = 0, errors = 0;
            await Promise.all(queries.map(async (query) => {
                try {
                    await ytsr(query, util.getYtsrSearchOptions())
                        .then(r => {
                            let items = r.items.filter(i => i.type === 'video');
                            let song = {
                                title: items[0].title, 
                                url: items[0].url
                            };
                            options.queue.addToQueue(message.guild.id, song);
                            count += 1;
                        }).catch(err => {
                            console.log(err);
                            errors += 1;
                        });

                } catch(err) { console.log('\nerr on query: ' + query); }
            }));

            message.channel.send(`${count} músicas adicionadas à fila`);
            if(errors > 0) {
                let msg = `Ocorreu erro em ${errors} caso(s) :(`;
                message.channel.send(msg);
            }

            await message.member.voice.channel.join()
                .then(con => {
                    options.queue.boundConnection(con,
                        message.channel, message.guild.id);
                    options.queue.play(message.guild.id, false);
                });
        } catch (err) {
            console.log(err);
            throw err;
        }
    },

}