/**
 * Created by James on 3/10/2016.
 */
Session.setDefault("onRendered", false);


_insertDrawing = function (drawingData, width, height) {
    Drawings.insert({
        user: Meteor.user(),
        ts: new Date(),
        room: Session.get("roomname"),
        data: drawingData,
        optimised: true,    // Prevents SVG Optimiser removing empty SVG.
        dimensions: {width: width, height: height}
    });
};

_updateDrawing = function (criteria, drawingData) {
    Drawings.update(criteria,
        {$set: {data: drawingData, optimised: false}
        });
    console.log("_updateDrawing");
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

_updateCanvas = function () {
    let svg = canvas.toSVG();
    Session.set("svg", svg);

    let latestDrawing = Drawings.findOne({}, {sort: {ts: -1}});
    _updateDrawing(latestDrawing._id,  svg);
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
    canvas.freeDrawingCursor = "url('pencil.png'), crosshair";

    let svg = canvas.toSVG();
    Session.set("svg", svg);

    _insertDrawing(svg, cWidth, cHeight);

    _setBrushSize(1);


});

Template.canvas.events({
    'click': function() {

        _updateCanvas();

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