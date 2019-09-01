const firebase = require('firebase/app');
require('firebase/firestore');

const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "bot-jao.firebaseapp.com",
    databaseURL: "https://bot-jao.firebaseio.com",
    projectId: "bot-jao",
    storageBucket: "bot-jao.appspot.com",
    messagingSenderId: "951915470251",
    appId: "1:951915470251:web:7b170c41a69b02cb"
};

class DataBase {

    constructor() {
        firebase.initializeApp(firebaseConfig);
    }

    getMensagens() {
        let msgs = [];
        let db = firebase.firestore();

        db.collection('mensagens').orderBy("id", "asc").get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    msgs.push(doc.data().msg);
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

        return msgs;
    }

    async getSoundBoard(guildId) {
        let sb = [];
        let db = firebase.firestore();

        await db.collection('soundboard').doc(guildId).collection('sounds').get()
            .then((snapshot) => {
                snapshot.forEach((doc) => {
                    console.log(doc.id, '=>', doc.data());
                    sb.push(doc.data());
                });
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

        return sb;
    }

    async getSound(guildId, sound) {
        let url;
        let db = firebase.firestore();
        let soundRef = db.collection('soundboard').doc(guildId).collection('sounds');

        await soundRef.doc(sound).get()
            .then((doc) => {
                url = doc.data().url;
            })
            .catch((err) => {
                console.log('Error getting documents', err);
            });

        return url;
    }

    async addSound(guildId, title, link) {
        let sound = {
            titulo: title,
            url: link
        }
        let db = firebase.firestore();
        try {
            let soundRef = db.collection('soundboard').doc(guildId).collection('sounds');
            let newSoundRef = await soundRef.doc(title).set(sound);
            return true;
        } catch (error) {
            return false;
        }
    }
}

module.exports = DataBase;