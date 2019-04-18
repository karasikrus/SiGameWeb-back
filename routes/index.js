const express = require('express');
const router = express.Router();

const fs = require('fs');
const file = './database/DB.json';

const expressWs = require('express-ws')(router);
let obj = {};



let connections = [];

/*router.get('/', function(req, res){
    res.send(JSON.stringify(obj));
});*/


router.ws('/', (ws, req) => {

    const curConn = {ws: ws};
    connections.push(curConn);

    fs.readFile(file, 'utf8', function (err, data) {
        if (err) throw err;
        obj = JSON.parse(data);
    });

    /*
    Отправка первоначального стейта при подключении.
     */
    ws.send(JSON.stringify(obj));


    ws.on('message', (msg) => {

        /*
        Функция рассылки всем активным пользователям стейта
         */
        function sendAllOnlineUsers(res) {
            connections.forEach((conn) => {
                conn.ws.send(JSON.stringify(res));
            })
        }

        if (typeof msg === 'string') {
            msg = JSON.parse(msg);
        }
        /*
        Смотрим какое событие пришло, если ADD, то значит необходимо записать файл и всем разослать
         */
        switch (msg.event) {
            case 'ADD':
                {
                    obj = msg.data;

                    fs.writeFile(file, JSON.stringify(obj), (err) => {
                        if (err) throw err;
                        console.log('The file has been saved!');
                    });

                    sendAllOnlineUsers(obj);
                }
                break;
            case 'READ':
                {}
                break;


        }
    });
    /*
    При закрытии соединения удаляем его из массива активных соединений для того чтобы не рассылать им стейт
     */
    ws.on('close', () => {
        console.log('connection with user ' + curConn.id + 'closed');
        connections = connections.filter(conn => {
            if (conn === curConn) {
                return false;
            }
            return true;
        });
    });
});


module.exports = router;
