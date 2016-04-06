_getRoom = function () {
    let mUser = Meteor.user();
    let room = Rooms.findOne({playersId: {$in:[mUser._id]}});
    return room;
}

Template.body.helpers({
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