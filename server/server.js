/**
 * Created by James on 3/7/2016.
 */

Meteor.startup(function () {
    Messages.remove({});
    Rooms.remove({});
    Drawings.remove({});
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
    },
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