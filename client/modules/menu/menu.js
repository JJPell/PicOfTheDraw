/**
 * Created by James on 3/17/2016.
 */

Session.setDefault("menuClicked", false);

Template.body.helpers({
    menuClicked: function () {
        return Session.get("menuClicked");
    }
});

Template.body.events({
    "click #menu": function (event) {
        let menuClicked = Session.get("menuClicked");
        Session.set("menuClicked", !menuClicked);
    }
});

Template.menuOnClick.helpers({
    room: function (currentUser) {
        if(currentUser) {
            return Rooms.findOne({players: {$in: [currentUser.username]}});
        }
    }
});

Template.menuOnClick.events({
    "click #leaveRoom": function (event) {
        if(Session.get("room")) {
            _leaveRoom(Meteor.user());
            Session.set("menuClicked", false);
        }
    },
    "click #changePassword": function (event) {
        Session.set("menuClicked", false);
    },
    "click #logOut": function (event) {
        Meteor.logout();
        Session.set("menuClicked", false);
    },
    "click #closeMenu": function (event) {
        Session.set("menuClicked", false);
    },
    "click #menuOnClickOverlay": function (event) {
        if(event.target.id === event.currentTarget.id) {
            Session.set("menuClicked", false);
        }
    }
});