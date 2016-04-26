/**
 * Created by James on 3/7/2016.
 */
String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1);
};

_setBrushSize = function (size) {
    if(size <= 1) {
        canvas.freeDrawingBrush.width  = 2;
    } else if(size === 2) {
        canvas.freeDrawingBrush.width  = 5;
    } else if(size === 3) {
        canvas.freeDrawingBrush.width  = 10;
    } else if(size >= 4) {
        canvas.freeDrawingBrush.width  = 20;
    }
};

class Tool {
    constructor(name, title, inputType, icon) {
        this.name = name.capitalize();
        this.title = title;
        this.id = name + "Tool";
        this.type = inputType;
        this.class = "tool";
        this.style = "background: url("+icon+");";
    }
};

var tools = [
    new Tool("draw", "Draw Mode", "button", "images/pencil.png"),
    new Tool("resize", "Resize Mode", "button", "images/resize.png"),
    new Tool("colour", "Colour Picker", "color", ""),
    new Tool("drawSize1", "Draw Size 1", "button", "images/drawSize1.png"),
    new Tool("drawSize2", "Draw Size 2", "button", "images/drawSize2.png"),
    new Tool("drawSize3", "Draw Size 3", "button", "images/drawSize3.png"),
    new Tool("drawSize4", "Draw Size 4", "button", "images/drawSize4.png"),
    new Tool("clear", "Clear Canvas", "button", "images/bin.png"),

];

Session.setDefault("tools", tools);
Session.setDefault("drawSize", 1);

Template.toolbar.helpers({
    tools: function () {
        return Session.get("tools");
    }
});

Template.toolbar.events({
    "click #drawTool": function () {
        canvas.isDrawingMode = true;
    },
    "click #resizeTool": function () {
        canvas.isDrawingMode = false;
    },
    "mouseleave #colourTool": function (event) {
        console.log(event.target.value);
        canvas.freeDrawingBrush.color = event.target.value;
    },
    "click #drawSize1Tool": function (event) {
        let drawSize = 1;
        Session.set("drawSize", drawSize);
        _setBrushSize(drawSize);
    },
    "click #drawSize2Tool": function (event) {
        let drawSize = 2;
        Session.set("drawSize", drawSize);
        _setBrushSize(drawSize);
    },
    "click #drawSize3Tool": function (event) {
        let drawSize = 3;
        Session.set("drawSize", drawSize);
        _setBrushSize(drawSize);
    },
    "click #drawSize4Tool": function (event) {
        let drawSize = 4;
        Session.set("drawSize", drawSize);
        _setBrushSize(drawSize);
    },
    "click #clearTool": function (event) {
        canvas.clear();
        _updateCanvas();
    }
});

Template.tool.helpers({

});

Template.tool.events({

});