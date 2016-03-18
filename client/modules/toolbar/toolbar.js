/**
 * Created by James on 3/7/2016.
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
}

class Tool {
    constructor(name, icon) {
        this.name = name.capitalize();
        this.id = name + "Tool";
        this.icon = icon;
    }
};

var tools = [
    new Tool("pen", ""),
    new Tool("colour", "")
];

Session.setDefault("tools", tools);


Template.toolbar.helpers({
    tools: function () {
        return Session.get("tools");
    }
});

Template.toolbar.events({

});

Template.tool.helpers({

});

Template.tool.events({

});