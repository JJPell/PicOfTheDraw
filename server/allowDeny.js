/**
 * Created by James on 4/7/2016.
 */

Rooms.allow({
    insert: function (userId) {
        return (Rooms.find({playersId: {$in: [userId]}}).count() < 1);
    },
    update: function (userId, doc, fieldNames, modifier) {
        return true;
    },
    remove: function () {
        return false;
    }
});

Rooms.deny({
    insert: function (userId, doc) {
        return (userId === null);
    },
    update: function (userId, doc, fieldNames, modifier) {
        return (userId === null);
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
        // // user must be logged in
        return (userId !== null);
    }
});

Drawings.allow({
    insert: function (userId, doc) {
        return (userId === doc.user._id);
    },
    update: function (userId, doc, fields, modifier) {
        // can only change your own documents
        return (userId === doc.user._id);
    }
});

Drawings.deny({
    insert: function (userId, doc) {
        // // user must be logged in
        return (userId === null);
    },
    update: function (userId, doc, fields, modifier) {
        // user must be logged in
        return (userId === null);
    },
    remove: function (userId, doc) {
        // cannot remove drawings
        return true;
    }
});

Game.deny({
    insert: function () {
        return true;
    },
    update: function () {
        return true;
    },
    remove: function () {
        return true;
    }
});