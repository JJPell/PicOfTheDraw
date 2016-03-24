/**
 * Created by James on 3/7/2016.
 */

Meteor.startup(function () {
    Messages.remove({});
    Rooms.remove({});
    Drawings.remove({});
});

_removeMessages = function (roomname) {
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
                    _removeMessages(callbackData.roomname);
                }
            });
        }
    }
});

Rooms.deny({
    insert: function (userId, doc) {
        return false;
    },
    update: function (userId, doc, fieldNames, modifier) {
        return false;
    },
    remove: function (userId, doc) {
        return false;
    }
});

Rooms.allow({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return true;
    },
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});

Messages.deny({
    insert: function (userId, doc) {
        return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function (userId, doc) {
        return true;
    }
});
Messages.allow({
    insert: function (userId, doc) {
        return (userId !== null);
    }
});
Drawings.allow({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return true;
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return true;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return true;
    },
    fetch: ['owner']
});

Drawings.deny({
    insert: function (userId, doc) {
        // the user must be logged in, and the document must be owned by the user
        return false;
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return false;
    },
    remove: function (userId, doc) {
        // can only remove your own documents
        return false;
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
