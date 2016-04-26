/**
 * Created by James on 3/10/2016.
 */
Session.setDefault("onRendered", false);
Session.setDefault("inputWord", undefined);


_insertDrawing = function (word) {
    Drawings.insert({
        user: Meteor.user(),
        ts: new Date(),
        room: Session.get("room"),
        word: word,
        guessed: false,
        data: undefined,
        optimised: true,    // Prevents SVG Optimiser removing empty SVG.
        dimensions: {}
    });
};

_setWord = function (word) {
    let r = Session.get('room');
    let id = Drawings.findOne({room: r}, {sort: {ts: -1}})._id;
    Drawings.update(id, {$set: {word: word}});

};

_updateDrawingData = function (criteria, drawingData) {
    Drawings.update(criteria,
        {
            $set: {
                data: drawingData,
                optimised: false
            }
        });
};

_updateDrawingInit = function (drawingData, width, height) {
    let r = Session.get('room');
    let id = Drawings.findOne({room: r}, {sort: {ts: -1}})._id;
    Drawings.update(id,
        {
            $set:
            {
                data: drawingData,
                dimensions:
                {
                    width: width,
                    height: height
                }
            }
        });
};

_setSvgDimensions = function (data, oldSize, newSize) {

    let svg = data;
    if(oldSize && newSize) {
        svg = svg.replace(oldSize.width.toString(), newSize.width.toString());
        svg = svg.replace(oldSize.height.toString(), newSize.height.toString());
    }
    return svg;
};

_canvasDimensions = function (containerId) {
    if(document.getElementById(containerId)) {
        let dimensions = {};
        let container = {
            width: document.getElementById(containerId).clientWidth,
            height: document.getElementById(containerId).clientHeight
        };

        if (container.height < container.width) {
            dimensions.width = container.height * 1.3333;
            dimensions.height = container.height;
        } else {
            dimensions.width = container.width;
            dimensions.height = container.width * 0.75;
        }

        let padding = (0.2 * dimensions.width);
        dimensions.width -= padding;
        dimensions.height -= padding;

        dimensions.width = Math.round(dimensions.width);
        dimensions.height = Math.round(dimensions.height);

        return dimensions;
    }

};

_updateCanvasSVG = function () {
    let svg = canvas.toSVG();
    Session.set("svg", svg);

    let latestDrawing = Drawings.findOne({}, {sort: {ts: -1}});
    _updateDrawingData(latestDrawing._id,  svg);
};

Template.canvas.onRendered(function () {

    let cWidth = _canvasDimensions("drawAreaContainer").width;
    let cHeight = _canvasDimensions("drawAreaContainer").height;

    Session.set("canvasDimensions", _canvasDimensions("drawAreaContainer"));

    canvas = new fabric.Canvas('drawArea', {
        isDrawingMode: true
    }).setDimensions({
        width: cWidth,
        height:cHeight
    });
    canvas.freeDrawingCursor = "url('cursors/pencil.png'), crosshair";

    let svg = canvas.toSVG();
    Session.set("svg", svg);

    _updateDrawingInit(svg, cWidth, cHeight);

    _setBrushSize(2);

});

Template.canvas.helpers({
    drawWord: function () {
        let room = Session.get('room');
        return Drawings.findOne({room: room}, {sort: {ts: -1}}).word.word;
    }
});

Template.canvas.events({
    'click': function() {

        _updateCanvasSVG();

    }
});

Template.svg.onRendered(function () {

    Session.set("canvasDimensions", _canvasDimensions("drawAreaContainer"));

});

Template.svg.helpers({
    svgData: function() {

        let drawing = Drawings.findOne({optimised: true}, {sort: {ts: -1}});
        let svgData = drawing.data;
        let currentDimensions = drawing.dimensions;
        let newDimensions = Session.get("canvasDimensions");

        return _setSvgDimensions(svgData, currentDimensions, newDimensions);

    }
});

Template.wordInput.events({
    'submit #wordInput': function(event) {
        event.preventDefault();
        console.log(event.target.category.value);

        _insertDrawing({
            word: event.target.word.value,
            category: event.target.category.value
        });

        event.target.word.value = "";
    }
});