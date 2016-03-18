/**
 * Created by James on 3/7/2016.
 */

class Room {
    constructor(attributes = {}) {
        this.roomname;
        this.players = [];
        this.playersId = [];
        this.roomCreator;
        this.roomCreatorId;
        this.maxPlayers = 8;
        this.playerDrawing;
        this.playerDrawingId;
        this.blackList = [];
        this.blackListId = [];

        for(var prop in attributes) {
            this[prop] = attributes[prop];
        };
    }
}

var menuButtons = {

    joinRoomBtn:        false,
    createRoomBtn:      false,
    joinRoomBackBtn:    false,
    joinRoomJoinBtn:    false,
    createRoomBackBtn:  false,

};

Session.setDefault("menuButtons", menuButtons);

_insertRoom = function (room = {}) {
    Rooms.insert(room);
};

_resetButtons = function () {
    Session.set("menuButtons", menuButtons);
};

_setButton = function (button) {
    let mBtns = Session.get("menuButtons");
    mBtns[button] = true;
    Session.set("menuButtons", mBtns);
};

_joinRoom = function (roomname, user = Meteor.user()) {

    let room = Rooms.findOne({roomname: roomname});
    let players = room.players;
    let playersId = room.playersId;

    if(!((players.indexOf(user.username) > -1) && (playersId.indexOf(user._id) > -1))) {
        players[players.length] = user.username;
        playersId[playersId.length] = user._id;

        console.log(players);
        Rooms.update({_id: room._id}, {$set: {players: players, playersId: playersId}});

        Session.set("room", roomname);

        return true;
    } else {
        return false;
    }
};

Template.roomMenuWrapper.helpers({
    menuButtons: function () {
        return Session.get("menuButtons");
    }
});

Template.roomMenuWrapper.events({
    "click .backBtn": function () {
        event.preventDefault();
        _resetButtons();
    },
    "click #joinRoomBtn": function (event) {
        event.preventDefault();
        _resetButtons();
        _setButton("joinRoomBtn");
    },
    "click #createRoomBtn": function (event) {
        event.preventDefault();
        _resetButtons();
        _setButton("createRoomBtn");
    },
});

Template.joinRoom.helpers({
    rooms: function () {
        return Rooms.find({}).fetch();
    }
});

Template.joinRoom.events({
    "click tr": function (event) {
        Session.set("selectedRoomname", this.roomname);
    },
    "click #joinRoomJoinBtn": function (event) {
        if(Session.get("selectedRoomname")) {
            event.preventDefault();
            _joinRoom(Session.get("selectedRoomname"));
        }
    }
});

Template.createRoom.events({
   "submit #createRoomForm": function (event) {
       event.preventDefault();
       console.log("SUBMIT");

       let newRoom = new Room({
           roomname: event.target.inputRoomName.value,
           maxPlayers: event.target.inputMaxPlayers.value,
           roomCreator: Meteor.user().username,
           roomCreatorId: Meteor.userId(),
           playerDrawing: Meteor.user().username,
           playerDrawingId: Meteor.userId()
       });

       _insertRoom(newRoom);
       _joinRoom(newRoom.roomname);
   }
});

Template.room.helpers({
    isHighlighted: function(row) {
        if(row === Session.get("selectedRoomname")) {
            return {class: "trHighlight"};
        }
    }
});