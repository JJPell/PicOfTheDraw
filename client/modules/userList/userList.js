/**
 * Created by James on 3/7/2016.
 */

_newTurn = function (user) {
    let username = user.username;
    let userId = user._id
    let room = Rooms.findOne({playersId: {$in:[userId]}});
    Rooms.update(room._id, {$set: {playerDrawing: username, playerDrawingId: userId}});
};

_removeRoom = function (roomId) {
    Rooms.remove(roomId);
}

_addToBlackList = function (user) {
    let room = Rooms.findOne({playersId: {$in:[user._id]}});
    Rooms.update(room._id, {$set: {blackList: user.username, blackListId: user._id}})
};

_leaveRoom = function (user) {

    let room = Rooms.findOne({playersId: {$in:[user._id]}});
    if(room) {
        if(room.roomCreatorId === user._id) {

            _removeRoom(room._id);

        } else {

            Rooms.update(room._id, {$pull: {players: {$in: [user.username]}}});
            Rooms.update(room._id, {$pull: {playersId: {$in: [user._id]}}});
        }
    }
};

_kickPlayer = function (user) {
    _leaveRoom(user);
    _addToBlackList(user);
};

Template.userList.helpers({
    roomname: function () {
        return Session.get("room");
    },
    players: function () {
        let player = Meteor.user().username;
        let room = Rooms.findOne({players: {$in:[player]}});
        let players = [];

        for(var i=0; i < room.players.length; i++) {
            players[i] = {_id: room.playersId[i], username: room.players[i]};
        }

        return players;
    },
    roomCreator: function () {
        let player = Meteor.user();
        let roomCreator = {
            username: Rooms.findOne({players: {$in: [player.username]}}).roomCreator,
            _id: Rooms.findOne({players: {$in: [player.username]}}).roomCreatorId,
        };
        return ((roomCreator.username === player.username) && (roomCreator._id === player._id));
    }
});

Template.userList.events({
    "click #leaveRoom": function (event) {
        _leaveRoom(Meteor.user());
    }
});

Template.user.helpers({
    roomCreator: function () {
        let player = Meteor.user();
        let roomCreator = {
            username: Rooms.findOne({players: {$in: [player.username]}}).roomCreator,
            _id: Rooms.findOne({players: {$in: [player.username]}}).roomCreatorId,
        };
        return ((roomCreator.username === player.username) && (roomCreator._id === player._id));
    }
});

Template.user.events({
    "click .draw": function (event) {
        _newTurn(this);
    },
    "click .kick": function (event) {
        _kickPlayer(this);
    }
});