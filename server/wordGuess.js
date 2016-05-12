/**
 * Created by James on 4/3/2016.
 */

let msgQuery = Messages.find({});
msgQuery.observeChanges({
    added: function (id, fields) {

        let roomname = Messages.findOne(id).room;
        let latestDrawing = Drawings.findOne({room: roomname}, {sort: {ts: -1}});

        if(latestDrawing && latestDrawing.word && (fields.user !== "server")) {

            let msg = fields.msg.toLowerCase();
            let word = latestDrawing.word.word.toLowerCase();
            if(msg.indexOf(word) > -1) {
                Drawings.update(latestDrawing._id, {$set: {guessed: true}});
                Rooms.update({roomname: roomname}, {
                    $set: {
                        playerDrawing: fields.user.username,
                        playerDrawingId: fields.user._id
                    }
                });
                _insertServerMsg(
                    fields.user.username+" guessed the word being drawn!",
                    roomname
                );
            }

        }

    }
});