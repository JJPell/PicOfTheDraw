/**
 * Created by James on 3/15/2016.
 */
Session.setDefault("toggleLoginRegister", false);

Template.signIn.helpers({
    toggleLoginRegister: function () {
        return Session.get("toggleLoginRegister");
    }
});

Template.login.helpers({
    loginError: function () {
        if(Session.get("loginError")) {
            return Session.get("loginError").reason;
        }
    }
});

Template.login.events({
    'submit form': function(event) {
        event.preventDefault();
        let username = event.target.loginUsername.value;
        let password = event.target.loginPassword.value;

        Meteor.loginWithPassword(username, password, function (Error) {
            //console.log("No Error")
            if(Error) {
                Session.set("loginError", Error)
            }
        });
    },
    "click #registerOption": function (event) {
        Session.set("toggleLoginRegister", true);
    }
});

Template.register.helpers({
    registerError: function () {
        if(Session.get("registerError")) {
            return Session.get("registerError").reason;
        }
    }
});

Template.register.events({
    'submit form': function(event) {
        event.preventDefault();
        let username = event.target.registerUsername.value;
        let password = event.target.registerPassword.value;
        let passwordConfirmation = event.target.registerPasswordConfirm.value;
        if(password===passwordConfirmation) {
            Accounts.createUser({
                username: username,
                password: password
            }, function (Error) {
                if(Error) {
                    Session.set("registerError", Error);
                }
            });
        } else {
            let error = {
                reason: "Passwords do not match"
            };
            Session.set("registerError", error);
        }

    },
    "click #loginOption": function (event) {
        event.preventDefault();
        Session.set("toggleLoginRegister", false);
    }
});