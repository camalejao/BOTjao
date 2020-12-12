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
        //console.log(gq.songs);
        if(gq.dispatcher.paused) {
            gq.dispatcher.resume();
        } else if(skip || !this.isPlaying(guildId)) {
            if(gq.songs.length) {
                let song = gq.songs.shift();
                gq.dispatcher = gq.connection.play(ytdl(song.url));
                gq.dispatcher.setVolume(1);
                gq.dispatcher.on('start', () => {gq.channel.send('Tocando ' + song.title)})
                gq.dispatcher.on('finish', () => {this.play(guildId, true)});
                gq.dispatcher.on('error', () => {this.play(guildId, true)});
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
        console.log('PLS')
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
            for(let s of gq.songs) {
                msg += s.title + '\n';
            }
            msg += '\nTotal de ' + gq.songs.length + ' música(s) na fila';
            gq.channel.send(msg);
        }
    }

    clearQueue(guildId) {
        this.guildQueue.delete(guildId);
    }
}

module.exports = Queue;