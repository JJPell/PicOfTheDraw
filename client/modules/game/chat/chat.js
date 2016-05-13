/**
 * Created by James on 3/7/2016.
 */

_sendMessage = function (elementId) {
    let el = document.getElementById(elementId);
    if(el.value) {
        Messages.insert({user: Meteor.user(), msg: el.value, ts: new Date(), room: _getRoom().roomname});
        el.value = "";
        el.focus();
    }
    $("#messages").scrollTop($("#messages")[0].scrollHeight);

};

Template.chat.helpers({
    creatingRoom: function () {
        return Session.get("creatingRoom");
    }
});

Template.messages.onRendered(function () {
    $("#messages").scrollTop($("#messages")[0].scrollHeight);
});

Template.messages.helpers({
    messages: function () {
        return Messages.find({room: _getRoom().roomname}, {sort: {ts: 1}});
    },
    roomname: function () {
        return _getRoom().roomname;
    }
});

Template.message.helpers({
    serverMsg: function () {
        if(this.user === "server") {
            return true;
        } else {
            return false;
        }
    },
    timestamp: function () {
        return this.ts.toLocaleTimeString();
    }
});

Template.input.events({
    'keyup #message': function (event) {
        if (event.type == "keyup" && event.which == 13) {
            _sendMessage("message");
        }
    }
});