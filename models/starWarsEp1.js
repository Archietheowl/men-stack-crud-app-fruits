const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    text: { type: String, require: true},
    user: {type: mongoose.Types.ObjectId, ref: 'User', required: true}
}, { timestaps: true // dynamically adds created and updatedAt field that auto updates.
})

const swCharacterSchema = new mongoose.Schema({
    name: {type: String, required: true },
    jediPowers: { type: Number, required: true },
    darkSide: { type: Number, required: true },
    greed: { type: Number, required: true },
    courage: { type: Number, required: true },
    flyingSkills: { type: Number, required: true },
    hallOfFame: { type: Number, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comments: [commentSchema]
})

const character = mongoose.model('SWCharacter', swCharacterSchema)

module.exports = character

// To be added
//oraniser: { type: mongoose.Types.ObjectId, ref: 'User', required: true }
//Attendees (Users - Referenced Many-to many)