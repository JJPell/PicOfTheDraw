/**
 * Created by James on 3/24/2016.
 */

_optimiseDrawingData = function (fields) {

    let svgo = new SVGO();
    return svgo.optimizeSync(fields.data);

};

let query = Drawings.find({});
query.observeChanges({
    changed: function (id, fields) {

        if(fields.data && !fields.optimised) {

            let optimisedData = _optimiseDrawingData(fields);

            Drawings.update(id, {$set: {data: optimisedData, optimised: true}});

        }
    }
});