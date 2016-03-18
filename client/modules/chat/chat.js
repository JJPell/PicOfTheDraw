/**
 * Created by James on 3/7/2016.
 */

_sendMessage = function (elementId) {
    var el = document.getElementById(elementId);
    Messages.insert({user: Meteor.user().username, msg: el.value, ts: new Date(), room: Session.get("roomname")});
    el.value = "";
    el.focus();
    el.scrollTop = el.scrollHeight;
};

Template.chat.helpers({
    creatingRoom: function () {
        return Session.get("creatingRoom");
    }
});

Template.messages.helpers({
    messages: function () {
        return Messages.find({room: Session.get("roomname")}, {sort: {ts: 1}});
    },
    roomname: function () {
        return Session.get("roomname");
    }
});

Template.message.helpers({
    timestamp: function () {
        return this.ts.toLocaleString();
    }
});

Template.input.events({
    'keyup #message': function (event) {
        if (event.type == "keyup" && event.which == 13) {
            _sendMessage("message");
        }
    }
});