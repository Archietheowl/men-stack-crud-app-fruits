// Imports
//const mongoose= require('mongoose')
//require('dotenv/config')

// Models
//const Characters = require('../models/starWarsEp1.js')
//


//Data
const characterData = require('db/data/data.js')
//const SWCharacter = require('../../models/starWarsEp1')
consolelog(characterData)

// //Run Seeds

// const runSeeds = async() => {
//     try{
//         //connect to database
//         await mongoose.connect(process.env.MONGODB_URI)
//         console.log('Dtaabase connection established')

//         //clear existing data
//         const deletedCharacters = await Characters.deleteMany()
//         console.log(`${deletedCharacters.deletedCount} characters deleted from the database`)

//         //add new character
//         const character = await SWCharacter.create(characterData)
//         console.log((`${character.length} characters added to the database`))
// add new user

//         //Close connection to database
//         await mongoose.connection.close()
//         console.log('Closing connection to MongoDB')
//     } catch (error){
//         console.log(error)
//     }
// }