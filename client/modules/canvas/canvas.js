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
        dimensions: {width: width, height: height}
    });
};

_updateDrawing = function (criteria, drawingData) {
    Drawings.update(criteria,
        {$set: {data: drawingData}
        });
};

_trimSvgData = function (data) {
    let svg = data;
    svg = svg.substring(svg.indexOf("<svg"));
    return svg;
};

_editSvgData = function (data, oldSize, newSize) {

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
        dimensions.width = (dimensions.width - padding);
        dimensions.height = (dimensions.height - padding);

        return dimensions;
    }

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

    let svg = _trimSvgData(canvas.toSVG());
    Session.set("svg", svg);

    _insertDrawing(svg, cWidth, cHeight);


});

Template.canvas.events({
    'click': function() {

        let svg = _trimSvgData(canvas.toSVG());
        Session.set("svg", svg);

        let latestDrawing = Drawings.findOne({}, {sort: {ts: -1}});
        _updateDrawing(latestDrawing._id,  svg);
        //console.log(canvas.toSVG())

    }
});

Template.svg.onRendered(function () {

    Session.set("canvasDimensions", _canvasDimensions("drawAreaContainer"));

});

Template.svg.helpers({
    svgData: function() {

        let svgData = Drawings.findOne({}, {sort: {ts: -1}}).data;
        let currentDimensions = Drawings.findOne({}, {sort: {ts: -1}}).dimensions;
        let newDimensions = Session.get("canvasDimensions")

        return _editSvgData(svgData, currentDimensions, newDimensions);

    }
});