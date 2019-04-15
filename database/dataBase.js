const sqlite3 = require('sqlite3');
const path = require('path');
const { dbName } = require('../config');

class DataBase {
    constructor() {
        this.db = new sqlite3.Database(
            path.join(__dirname, './' + dbName),
            sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
            (err) => {
                if (err) {
                    console.error(err.message);
                }
                console.log('Connected to the chat database.');
            });

        this.userTableName = 'user';
        this.questionTableName = 'question';

        this.db.serialize(() => {
            const SQLUserTable =
                `CREATE TABLE IF NOT EXISTS ${this.userTableName}(
           id INTEGER PRIMARY KEY,
           login TEXT NOT NULL
           avatarPictureUrl TEXT);`;

            const SQLQuestionTable =
                `CREATE TABLE IF NOT EXISTS ${this.questionTableName}(
           id INTEGER PRIMARY KEY,
           questionType TEXT NOT NULL,
           questionText TEXT NOT NULL,
           CorrectAnswer TEXT NOT NULL`;

            this.db
                .run(SQLUserTable)
                .run(SQLQuestionTable)
        })
    }

    close() {
        this.db.close((err) => {
            if (err) {
                console.error(err.message);
            }
            console.log('Close the database connection.');
        });
    }
}

module.exports = new DataBase();
