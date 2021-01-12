const ytdl = require('ytdl-core-discord');

class Queue {
    constructor() {
        this.guildQueue = new Map();
    }

    getQueue(guildId) {
        let gq = this.guildQueue.get(guildId);
        if(!gq) {
            this.guildQueue.set(guildId,
                { songs: [], channel: {}, connection: {}, dispatcher: {} });
        }
        return this.guildQueue.get(guildId);
    }

    addToQueue(guildId, song) {
        let gq = this.getQueue(guildId);
        gq.songs.push(song);
        this.guildQueue.set(guildId, gq);
    }

    boundConnection(connection, channel, guildId) {
        let gq = this.getQueue(guildId);
        gq.connection = connection;
        gq.channel = channel;
        this.guildQueue.set(guildId, gq);
    }

    async play(guildId, skip) {
        let gq = this.getQueue(guildId);
        if(gq.dispatcher.paused) {
            gq.dispatcher.resume();
        } else if(skip || !this.isPlaying(guildId)) {
            if(gq.songs.length) {
                let song = gq.songs.shift();
                try {
                    gq.dispatcher = gq.connection.play(
                        await ytdl(song.url, {filter: 'audioonly'}),
                        {type: 'opus'}
                    );
                    //gq.dispatcher.setVolume(1);
                    gq.dispatcher.on('start', () => {
                        console.log(`Playing ${song.title}`);
                        gq.channel.send('Tocando ' + song.title);
                    });
                    gq.dispatcher.on('finish', () => {
                        console.log(`Finished ${song.title}`);
                        gq.dispatcher.destroy();
                        this.play(guildId, true);
                    });
                    gq.dispatcher.on('error', () => {
                        console.log(`Error on ${song.title}`);
                        console.log(gq.dispatcher);
                        gq.dispatcher.destroy();
                        console.log(song);
                        this.play(guildId, true);
                    });
                } catch (err) {
                    console.log(err);
                    this.play(guildId, true);
                }
            } else {
                if(Object.keys(gq.dispatcher).length) {
                    gq.dispatcher.destroy();
                    gq.dispatcher = {};
                }
            }
        }
    }

    pause(guildId) {
        let gq = this.getQueue(guildId);
        try {
            if(!gq.dispatcher.paused) {
                gq.dispatcher.pause(true);
            }
        } catch(err) { console.error(err) }
    }

    resume(guildId) {
        let gq = this.getQueue(guildId);
        try {
            if(gq.dispatcher.paused){
                gq.dispatcher.resume();
            }
        } catch(err) { console.error(err) }
    }

    skip(guildId) {
        this.play(guildId, true);
    }

    isPlaying(guildId) {
        let gq = this.getQueue(guildId);
        return Object.keys(gq.dispatcher).length;
    }

    checkQueue(guild, channel) {
        let gq = this.getQueue(guild.id);

        if(!gq.songs.length) {
            channel.send('Fila vazia');
        } else {
            let embed = {
                title: `Fila de músicas de ${guild.name}`,
                color: 0x0099ff,
                fields: []
            };
            let i = 0, songList = '';
            for(let s of gq.songs) {
                if (songList.length >= 850) {
                    songList += `E mais ${gq.songs.length - i}, mas não cabe(m) nessa mensagem!\n`
                    break;
                }
                songList += `${++i}. ${s.title}\n`;
            }
            songList += `\nTotal de ${gq.songs.length} música(s) na fila`;
            embed.fields.push({
                name: 'Próximas músicas',
                value: songList
            });

            channel.send({ embed: embed }).catch(console.error);
        }
    }

    clearQueue(guildId) {
        this.guildQueue.delete(guildId);
    }
}

module.exports = Queue;