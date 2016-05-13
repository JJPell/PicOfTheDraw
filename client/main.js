_getRoom = function () {
    let mUser = Meteor.user();
    let room = Rooms.findOne({playersId: {$in:[mUser._id]}});
    return room;
};