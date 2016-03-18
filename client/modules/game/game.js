/**
 * Created by James on 3/7/2016.
 */

Template.game.helpers({
    playersTurn: function (player) {
        let roomPlayerDrawing = Rooms.findOne({players: {$in:[player.username]}}).playerDrawing;
        return (player.username === roomPlayerDrawing);
    }
});