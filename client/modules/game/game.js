/**
 * Created by James on 3/7/2016.
 */

Template.gameWrapper.helpers({
    room: function (currentUser) {
        if(currentUser) {
            let room = Rooms.findOne({players: {$in: [currentUser.username]}});
            if(room) {
                Session.set("room", room.roomname);
                return room;
            } else {
                Session.set("room", null);
            }
        }
    },
    loggingInClicked: function () {
        return Session.get("loggingInClicked");
    }
});

Template.game.helpers({
    playersTurn: function (player) {
        let roomPlayerDrawing = Rooms.findOne({players: {$in:[player.username]}}).playerDrawing;
        return (player.username === roomPlayerDrawing);
    },
    inputWord: function () {
        let room = Session.get("room");
        if(room) {
            let drawing = Drawings.findOne({room: room}, {sort: {ts: -1}});
            if(drawing && drawing.word && !drawing.guessed) {
                return false;
            } else {
                return true;
            }
        }
    }
});