const mongoose = require('mongoose')

const swCharacterSchema = new mongoose.Schema({
    name: {type: String, required: true },
    jediPowers: { type: Number, required: true },
    darkSide: { type: Number, required: true },
    greed: { type: Number, required: true },
    courage: { type: Number, required: true },
    flyingSkills: { type: Number, required: true },
    hallOfFame: { type: Number, required: true },
    forceUser: { type: Boolean, required: true},
    creator: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'User',}
})

const SWCharacter = mongoose.model('SWCharacter', swCharacterSchema)

module.exports = SWCharacter

// To be added
//oraniser: { type: mongoose.Types.ObjectId, ref: 'User', required: true }



//Attendees (Users - Referenced Many-to many)