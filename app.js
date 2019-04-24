const express = require('express');
const path = require('path');

//Подключение БД, но в нашем случае используем JSON файл
//const db = require('./database/dataBase');
//const db = require('./database/DB.json');

//Для работы с файлами
const fs = require('fs');
const jsonfile = require('jsonfile')

const bodyParser = require('body-parser');

const { frontHost } = require('./config');

const cors = require('cors');

const PORT = process.env.PORT || 5000;

const app = express();
const expressWs = require('express-ws')(app);

const indexRouter = require('./routes/index');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({ credentials: true, origin: frontHost }));

fs.readFile('./database/DB.json', 'utf8', function (err, data) {
    if (err) throw err;
    app.obj = JSON.parse(data);
});

app.use('/', indexRouter);

app.listen(PORT, () =>
    console.log('Express app listening on localhost: ' + PORT));


module.exports = app;
