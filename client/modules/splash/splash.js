/**
 * Created by James on 3/27/2016.
 */

Session.setDefault("loggingInClicked", false);

Template.splash.events({
    "click #playNow": function () {
        Session.set("loggingInClicked", true);
    }
});