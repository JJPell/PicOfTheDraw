/**
 * Created by James on 5/13/2016.
 */

Router.configure({
    notFoundTemplate: "home"
});

Router.route('/', {
    name: 'home',
    template: 'splash',
    onBeforeAction: function () {
        var currentUser = Meteor.userId();
        if(currentUser){
            this.redirect("/game");
        } else {
            this.next();
        }
    }
});

Router.route('/login', {
    name: 'login',
    template: 'login',
    onBeforeAction: function () {
        var currentUser = Meteor.userId();
        if(currentUser){
            this.redirect("/game");
        } else {
            this.next();
        }
    }
});

Router.route('/register', {
    name: 'register',
    template: 'register',
    onBeforeAction: function () {
        var currentUser = Meteor.userId();
        if(currentUser){
            this.redirect("/game");
        } else {
            this.next();
        }
    }
});

Router.route('/game', {
    name: 'game',
    template: 'gameWrapper',
    onBeforeAction: function () {
        var currentUser = Meteor.userId();
        if(currentUser){
            this.next();
        } else {
            this.redirect("/login");
        }
    }
});