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

    let room;
    room = Rooms.findOne({_id: roomId});
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

Meteor.publish("rooms", function () {
    return Rooms.find();
});
Meteor.publish("messages", function () {
    return Messages.find({}, {sort: {ts: -1}});
});
Meteor.publish("drawings", function () {
    return Drawings.find();
});
