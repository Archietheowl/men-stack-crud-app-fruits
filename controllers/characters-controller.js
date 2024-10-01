// Imports / Requirements
const mongoose = require('mongoose')
const express = require('express')

// Router
const router = express.Router()

// Model
const characters = require ('../models/starWarsEp1.js')


//Middleware Functions
//const isSignedIn = require('../middleware/is-signed-in.js')


// Routes
// Remeber that each ROUTE is already prepended with "characters"

//Character Index Route
router.get("/", async (req, res) => {  //This route is "/" because it's prepended and it's name is index
    try {
        const allCharacters = await characters.find();
        return res.render('characters/index.ejs', { allCharacters })
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    }
})

//New Page (form page)                     
router.get("/new", (req, res) => {
    res.render("characters/new.ejs");
})

// //Show Page 
// // Always make sure that a route with something like an id goes after other routes so it doesn't catch them by accident!
router.get("/:characterId", async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
            const foundCharacter = await characters.findById(req.params.characterId)//.populate('creator');
            if (!foundCharacter) return next()
            //console.log('creator ID:', character.creator._id)
            //console.log('Logged in user ID:' res.locals.user._id)
            //console.log('Do they match?', character.creator._id.equals(res.locals.user._id))
            return res.render("characters/show.ejs", { character: foundCharacter });
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    }
});

// Create Route (sending the data from the body of new.ejs to the db creating a new doc)
//???????????????????????????????????????? The line below why is it just / rather than /new
router.post("/", async (req, res) => {
    try {
        //req.body.organiser = req.session.user._id  // Add the organiser ObjectId using the authenticated user's _id (from the session)
        if (req.body.forceUser === 'on') {
            req.body.forceUser = true
        } else {
            req.body.forceUser = false       ///NEED TO COME BACK TO THIS CODE
        }
        req.body.creator = req.session.user._id;
        await characters.create(req.body)
        return res.redirect('/characters/index')
    } catch {
        return res.status(500).send('<h1>An error occured.</h1>')

    }
})


// Delete ROUTE
router.delete("/:characterId", (req, res) => {
    console.log("You hit delete");
    res.send("This is the delete route");
    
});
// router.delete('/:characterId', async (req, res) => {
//     try {
//         if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
//             await characters.findByIdAndDelete(req.params.characterId);
//             return res.redirect('/characters');
//         } else {
//             next()
//         }
//     }catch(error){
//         console.log(error)
//         return res.status(500).send('<h1>An error occured.</h1>')
//     }
        
// });

//Update Form Page GET ROUTE
router.get('/:characterId/edit', async (req, res, next) => {
    try{
        if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
        const foundCharacter = await characters.findById(req.params.characterId)
        if(!foundCharacter) return next()
        return res.render("characters/edit.ejs", { character: foundCharacter });
    }
    next()
    }catch(error){
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    } 
});

//Update Route path
router.put('/:characterId', async (req, res) => {
    //Have to handle the tickbox boolean or it'll crash it
    try {
        if (req.body.forceUser === "on") {
            req.body.forceUser = true;
        } else {
            req.body.forceUser = false;
        }//Update the character in the database
    
        const updatedCharacter = await characters.findByIdAndUpdate(req.params.characterId, req.body, //{new: true} < what's this?
            );
        console.log(updatedCharacter )
        res.redirect(`/characters/${req.params.characterId}`);
    }catch(error){
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    }
})


// Export Router
module.exports = router