const ytdl = require('ytdl-core');

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

    play(guildId, skip) {
        let gq = this.getQueue(guildId);
        if(gq.dispatcher.paused) {
            gq.dispatcher.resume();
        } else if(skip || !this.isPlaying(guildId)) {
            if(gq.songs.length) {
                let song = gq.songs.shift();
                try {
                    gq.dispatcher = gq.connection.play(ytdl(song.url, {filter: 'audioonly'}));
                    gq.dispatcher.setVolume(1);
                    gq.dispatcher.on('start', () => {gq.channel.send('Tocando ' + song.title)});
                    gq.dispatcher.on('finish', () => {this.play(guildId, true)});
                    gq.dispatcher.on('error', () => {this.play(guildId, true)});
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

    checkQueue(guildId, channel) {
        let gq = this.getQueue(guildId);

        if(!gq.songs.length) {
            channel.send('Fila vazia');
        } else {
            let msg = 'Próximas músicas:\n';
            let i = 0;
            for(let s of gq.songs) {
                if (msg.length >= 1800) {
                    msg += `E mais ${gq.songs.length - i}, mas não cabe(m) nessa mensagem!\n`
                    break;
                }
                msg += `${++i}. ${s.title}\n`;
            }
            msg += `\nTotal de ${gq.songs.length} música(s) na fila`;
            gq.channel.send(msg);
        }
    }

    clearQueue(guildId) {
        this.guildQueue.delete(guildId);
    }
}

module.exports = Queue;