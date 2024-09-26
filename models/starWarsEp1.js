const mongoose = require('mongoose')

const swCharacterSchema = new mongoose.Schema({
    name: {type: String, required: true },
    jediPowers: { type: Number, required: true },
    darkSide: { type: Number, required: true },
    greed: { type: Number, required: true },
    courage: { type: Number, required: true },
    flyingSkills: { type: Number, required: true },
    hallOfFame: { type: Number, required: true },
    forceUser: { type: Boolean, required: true}
})

const SWCharacter = mongoose.model('SWCharacter', swCharacterSchema)


module.exports = SWCharacter

