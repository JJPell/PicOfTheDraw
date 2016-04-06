/**
 * Created by James on 3/24/2016.
 */

var oldPlayers = [];

_insertServerMsg = function (text, roomname) {
    Messages.insert({user: "server", msg: text, ts: new Date(), room: roomname});
};

var playerRoomMessage = function (players, roomname) {

    console.log("players: "+players);
    console.log("oldPlayers: "+oldPlayers);

    let playersAdded = players.map(function (cb) {
        if(oldPlayers.indexOf(cb) < 0) {
            return cb;
        }
    });

    let playersRemoved = oldPlayers.map(function (cb) {
        if(players.indexOf(cb) < 0) {
            return cb;
        }
    });

    playersAdded.sort();
    playersRemoved.sort();

    console.log("players Added: "+playersAdded[0]);
    console.log("players Removed: "+playersRemoved[0]);

    if(playersAdded[0] !== undefined) {
        let message = playersAdded[0] +" has joined the room.";
        _insertServerMsg(message, roomname);
    } else if(playersRemoved[0] !== undefined) {
        let message = playersRemoved[0] +" has left the room.";
        _insertServerMsg(message, roomname);
    }

    oldPlayers = players;

};

let query = Rooms.find({});
query.observeChanges({
    changed: function (id, fields) {
        if(fields.players) {

            let room  = Rooms.findOne(id);
            playerRoomMessage(fields.players, room.roomname);

        }
        if(fields.playerDrawing) {
            let room  = Rooms.findOne(id);
            let msg = fields.playerDrawing + " is now Drawing.";
            _insertServerMsg(msg, room.roomname);
        }

    }
});

let drawingQuery = Drawings.find({});
drawingQuery.observeChanges({
    added: function (id, fields) {
        let msg = fields.user.username + " has picked the category "+ fields.word.category;
        let room = fields.room;
        _insertServerMsg(msg, room);
    }
});