/*
 * Created by James on 3/17/2016.
 */

class button {
    constructor(btn) {
        let defaultBtn = {
            id:         "",
            type:       "button",
            class:      "list-group-item",
            disabled:   undefined,
            text:       ""
        };

        for(var variable in defaultBtn) {
            btn[variable] = btn[variable] || defaultBtn[variable];
        }

        this.attributes = {
            id:         btn.id,
            type:       btn.type,
            class:      btn.class,
            disabled:   btn.disabled
        };
        this.text = btn.text;
    }

    disable() {
        this.attributes.disabled = true;
        this.attributes.class = "list-group-item disabled";
    }

    enable() {
        this.attributes.disabled = undefined;
        this.attributes.class = "list-group-item";
    }
}

Session.setDefault("menuClicked", false);

_buttonConditions = function (buttons) {
    if(Session.get("room")) {
        buttons[0].enable();
    } else {
        buttons[0].disable();
    }
    buttons[1].disable()


};

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
    },
    button: function () {
        let buttons = [
            new button({id: "leaveRoom", text: "Leave Room"}),
            new button({id: "changePassword", text: "Change Password"}),
            new button({id: "about", text: "About"}),
            new button({id: "logOut", text: "Log Out"})
        ];
        _buttonConditions(buttons);
        return buttons;
    }
});

Template.menuOnClick.events({
    "click #leaveRoom": function (event) {
        console.log("#leaveRoom");
        _leaveRoom(Meteor.user());
        Session.set("menuClicked", false);
    },
    "click #changePassword": function (event) {
        Session.set("menuClicked", false);
    },
    "click #about": function (event) {
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