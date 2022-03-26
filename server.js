const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const ACTIONS = require('./src/Actions');

const server = http.createServer(app);
const io = new Server(server);

 app.use(express.static('build'));
 app.use((req, res, next) => {
     res.sendFile(path.join(__dirname, 'build', 'index.html'));
 });

//whenever a user join , their username and socket id are stored inside this
const userSocketMap = {};
//to get list of all users inside the room
function getAllConnectedClients(roomId) {
    //this code will get the array of socketIds with the roomId in the adapter if not give empty array
    //on mapping the array recieved
    return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(
        (socketId) => {
            //will get single client in each iteration
            return {
                socketId,
                username: userSocketMap[socketId],
            };
        }
    );
}

io.on('connection', (socket) => {
    console.log('socket connected', socket.id);

    socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
        userSocketMap[socket.id] = username;
        //below line will make socket to join the room with roomId if existing or will create a new one
        socket.join(roomId);
        //getting all users details of a room
        const clients = getAllConnectedClients(roomId);
        //loop all clients
        clients.forEach(({ socketId }) => {
            //it will notify each user than particular user has joined the room
            io.to(socketId).emit(ACTIONS.JOINED, {
                clients,
                username,
                socketId: socket.id,
            });
        });
    });

    //code transfer via socket
    socket.on(ACTIONS.CODE_CHANGE, ({ roomId, code }) => {
                //to send code to all the clients
        socket.in(roomId).emit(ACTIONS.CODE_CHANGE, { code });
    });

        //auto sync on first load
    socket.on(ACTIONS.SYNC_CODE, ({ socketId, code }) => {
        io.to(socketId).emit(ACTIONS.CODE_CHANGE, { code });
    });

        // if user close tab of browser then it will send this event
    socket.on('disconnecting', () => {
                //get all rooms of particular socket
        const rooms = [...socket.rooms];
        rooms.forEach((roomId) => {
            socket.in(roomId).emit(ACTIONS.DISCONNECTED, {
                socketId: socket.id,
                username: userSocketMap[socket.id],
            });
        });
        delete userSocketMap[socket.id];
               //to leave a room officialy
        socket.leave();
    });
});

// to listen it at port
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Listening on port ${PORT}`));
