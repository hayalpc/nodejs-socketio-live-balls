const socketio = require('socket.io');
const randomColor = require('../helpers/calculateColor');

const io = socketio();

const socketApi = {};
socketApi.io = io;

const users = {};

io.on('connection',(socket)=>{
    socket.on('newUser',(data)=>{
        const defaultData = {
            id:socket.id,
            position:{
                x:0,
                y:0
            },
            color:randomColor(),
        };
        const userData = Object.assign(data,defaultData);
        console.log(userData);
        users[socket.id] = userData;
        socket.broadcast.emit('newUser',users[socket.id]);
        socket.emit('initPlayers',users);
    });

    socket.on('disconnect',()=>{
       socket.broadcast.emit('disUser',users[socket.id]);
       delete users[socket.id];
    });

    socket.on('newMessage',(data)=>{
       socket.broadcast.emit('newMessage',data);
    });

    socket.on('animate',(data)=>{
        try{
            users[socket.id].position.x = data.x;
            users[socket.id].position.y = data.y;
            socket.broadcast.emit('animate',{socketId:socket.id,x:data.x,y:data.y});
        }catch(e){

        }

    });
});



module.exports = socketApi;