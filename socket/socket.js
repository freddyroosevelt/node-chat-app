module.exports = function(io, rooms) {
    var chatrooms = io.of('/roomlist').on('connection', function(socket) {
        console.log('Connection Established on the Server!');
        // broadcast active rooms
        socket.emit('roomupdate', JSON.stringify(rooms));

        // Append the data for new rooms created
        socket.on('newroom', function(data) {
            rooms.push(data);
            // update rooms with names
            socket.broadcast.emit('roomupdate', JSON.stringify(rooms));
            // broadcast back to active user who created room
            socket.emit('roomupdate', JSON.stringify(rooms));
        });
    });

    // Room Messages handler
    var messages = io.of('/messages').on('connection', function(socket) {
        console.log('Connected to the chatroom!');

        // Event handler
        socket.on('joinroom', function(data) {
            socket.username = data.user;
            socket.userPic = data.userPic;
            socket.join(data.room);
            updateUserList(data.room, true);
        });

        socket.on('newMessage', function(data) {
            socket.broadcast.to(data.room_number).emit('messagefeed', JSON.stringify(data));
        });

        function updateUserList(room, updateAll) {
            var getUsers = io.of('/messages').clients(room);
            var userlist = [];
            for(var i in getUsers) {
                userlist.push({user:getUsers[i].username, userPic:getUsers[i].userPic});
            }
            socket.to(room).emit('updateUsersList', JSON.stringify(userlist));

            if (updateAll) {
                socket.broadcast.to(room).emit('updateUsersList', JSON.stringify(userlist));
            }
        }

        socket.on('updateList', function(data) {
            updateUserList(data.room);
        })
    });
}
