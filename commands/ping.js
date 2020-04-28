module.exports = {
    name: 'ping',
    description: 'Pong! E também mostra a latência',
    websocket: true,
    category: 'general',
    async execute(message, options) {
        const ws = options.ws;
        const m = await message.channel.send("Ping?");
        m.edit(`Pong! Latência de ${m.createdTimestamp - message.createdTimestamp}ms. Latência da API: ${Math.round(ws.ping)}ms`);
    }
}