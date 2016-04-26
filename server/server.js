/**
 * Created by James on 3/7/2016.
 */

Meteor.startup(function () {
    Messages.remove({});
    Rooms.remove({});
    Drawings.remove({});
});

_removeRoomMessages = function (roomname) {
    Messages.remove({room: roomname});
};

_removeRoom = function (id, roomname) {

    Rooms.remove({_id: id});
    if(roomname) {
        console.log("The room '"+roomname+"' has closed/been removed.")
    } else {
        console.log("A room has closed/been removed.")
    }
};

_removeRoomDrawings = function (roomname) {
    Messages.remove({room: roomname});
}

_checkForRoomCreator = function (roomId, playersId, callback) {

    let room = Rooms.findOne({_id: roomId});
    let roomCreatorId = room.roomCreatorId;
    let roomname = room.roomname;

    let callbackObj = {
        result: false,
        id: roomId,
        roomname: roomname
    };

    if(playersId.indexOf(roomCreatorId) === -1) {
        callback(callbackObj);
        return false;
    } else {
        callbackObj.result = true;
        callback(callbackObj);
        return true;
    }
};

// Remove room if room creator leaves

var query = Rooms.find({});
query.observeChanges({
    changed: function (id, fields) {

        //console.log(JSON.stringify(fields, null, 4));
        if(fields.playersId) {
            _checkForRoomCreator(id, fields.playersId, function (callbackData) {
                if(callbackData.result === false) {
                    _removeRoom(callbackData.id, callbackData.roomname);
                    _removeRoomMessages(callbackData.roomname);
                    _removeRoomDrawings(callbackData.roomname);
                }
            });
        }
    }
});

// Remove room if room creator is offline for more than delayTime (milliseconds)

let delayTime = 30000;
let timeouts = [];

Meteor.users.find({ "status.online": false }).observeChanges({
    added: function(id, fields) {
        // id just went offline
        let room = Rooms.findOne({roomCreatorId: id});

        if( room ) {

            timeouts.push( {
                    id: id,
                    handle: Meteor.setTimeout(function () {

                        _removeRoom(room._id, room.roomname);
                        _removeRoomMessages(room.roomname);
                        _removeRoomDrawings(room.roomname);

                    }, delayTime)
            });
            console.log("Removing room: "+room.roomname+" in 30 seconds as room creator is offline.")

            _insertServerMsg(
                "The room creator has left and so the room will close in 30 seconds.",
                room.roomname
            );
        }
    },
    removed: function(id, fields) {

        let room = Rooms.findOne({roomCreatorId: id});

        if( room ) {
            timeouts.forEach(function (item, index) {
                if(item.id === id) {
                   Meteor.clearTimeout(item.handle);
                   timeouts.splice(index);
                }
                console.log("No longer removing room as user has reconnected.")
            });

            _insertServerMsg(
                "The room creator has rejoined and so the room will no longer close",
                room.roomname
            );
        }
    }
});


// Publish

Meteor.publish("rooms", function () {
    return Rooms.find();
});
Meteor.publish("messages", function () {
    return Messages.find({}, {sort: {ts: -1}});
});
Meteor.publish("drawings", function () {
    return Drawings.find();
});
