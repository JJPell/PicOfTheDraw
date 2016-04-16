/**
 * Created by James on 4/3/2016.
 */

let msgQuery = Messages.find({});
msgQuery.observeChanges({
    added: function (id, fields) {

        let roomname = Messages.findOne(id).room;
        let latestDrawing = Drawings.findOne({room: roomname}, {sort: {ts: -1}});

        if(latestDrawing && latestDrawing.word) {

            let msg = fields.msg.toLowerCase();
            let word = latestDrawing.word.word.toLowerCase();
            if(msg === word) {
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