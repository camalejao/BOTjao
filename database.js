const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const url = process.env.MONGODB_URI;
const dbName = process.env.DB_NAME;
const colName = 'guilds';

const client = new MongoClient(url, { useUnifiedTopology: true });
var _db;

module.exports = {

    connect(callback) {
        client.connect((err) => {
            assert.equal(null, err);
            console.log("Connected to MongoDB server");
            _db = client.db(dbName);
            return callback(err);
        });
    },

    joinGuild(guildId) {
        let guild = { guildId: guildId, soundboard: [] };
        _db.collection(colName).insertOne(guild)
            .then((doc) => console.log(`Guild ${guildId} added to database`))
            .catch((err) => console.log(err));
    },

    leaveGuild(guildId) {
        _db.collection(colName).deleteOne({ guildId: guildId })
            .then((doc) => {
                console.log(doc.result);
                console.log(`Guild ${guildId} removed from database`)
            }).catch((err) => console.log(err));
    },

    async getSoundBoard(guildId) {
        let sb = [];
        await _db.collection(colName).findOne({ guildId: guildId }, { projection: { soundboard: 1 } })
            .then((doc) => sb = doc.soundboard)
            .catch((err) => console.log(err));
        return sb;
    },

    async getSound(guildId, title) {
        let url;
        const opts = { projection: { soundboard: { '$elemMatch': { 'title': title } } } };
        await _db.collection(colName).findOne({ guildId: guildId }, opts)
            .then((doc) => url = doc.soundboard[0].url)
            .catch((err) => console.log(err));
        return url;
    },

    async addSound(guildId, title, url) {
        let matchQuery = { guildId: guildId, 'soundboard.title': title };
        let updateQuery = { $set: { 'soundboard.$.url': url } };
        let pushQuery = { $push: { soundboard: { title: title, url: url } } };
        try {
            await _db.collection(colName).updateOne(matchQuery, updateQuery)
                .then((doc) => {
                    console.log(doc.result);
                    if(doc.result.n) {
                        return true;
                    } else {
                        _db.collection(colName).updateOne({ guildId: guildId }, pushQuery)
                            .then((doc) => console.log(doc.result))
                    }
                });
            return true;
        } catch(err) {
            console.log(err);
            return false;
        }
    }
}