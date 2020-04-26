module.exports = {
    name: 'carolina',
    aliases: ['carol', 'demonia'],
    description: 'Risada? Golfinho? Invocação de demônios? Não sei',
    voice: true,
    guildOnly: true,
    execute(message) {
        message.member.voice.channel.join()
            .then(connection => {
                const url = 'https://www.myinstants.com/media/sounds/carolina.mp3';
                const dispatcher = connection.play(url);
                dispatcher.setVolume(1);
            })
            .catch(err => console.log(err));
    }
}