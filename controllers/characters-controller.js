// Imports 
// Express, model, morgan, methodOveride
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const express = require('express')
// Router
const router = express.Router()

// Model
const characters = require ('../models/starWarsEp1.js')

// Route Handlers

// Landing Page Route
router.get("/", async (req, res) => {
    try{
        const characters = await Event.find()
        return res.render('characters/index.ejs', {characters})
    } catch(error) {
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    }
})

//New Page (form page)                     
router.get("/new", (req, res) => {
    res.render("characters/new.ejs");
})

// Create Route
router.post("/characters", async (req, res) => {
    try {
        if (req.body.forceUser === 'on') {
            req.body.forceUser = true
        } else {
            req.body.forceUser = false
        }
        //   req.body.isReadyToEat = !!req.body.isReadyToEat  (A shorter method of converting to boolean value)
        const character = await characters.create(req.body)
        return res.redirect('/characters/')
    } catch {
        return res.status(500).send('Something went wrong')

    }
})

//Character Index Route
router.get("/characters", async (req, res) => {
    try {
        const allCharacters = await characters.find();
        return res.render("/index.ejs", { characters: allCharacters });

    } catch {                         //CHECK IF THIS IS THE CORRECT CODE
        return res.status(500).send('Something went wrong')
    }

})

// //Show ROUTE
// // Always make sure that a route with something like an id goes after other routes so it doesn't catch them by accident!
router.get("/:characterId", async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
            const foundCharacter = await SWCharacter.findById(req.params.characterId);
            if (!foundCharacter) return next()
            return res.render("characters/show.ejs", { character: foundCharacter });

        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('Something went wrong2')
    }
});

// Delete ROUTE
router.delete('/:characterId', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
        await characters.findByIdAndDelete(req.params.characterId);
    } else {
        next()
    }
    res.redirect('/characters');
});

//Update Form Page GET ROUTE
router.get('/:characterId/edit', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
        const foundCharacter = await characters.findById(req.params.characterId)
    } else {
        next()
    }
    res.render("characters/edit.ejs", {
        character: foundCharacter,
    })
});
//Update Route path
router.put('/:characterId', async (req, res) => {
    //Have to handle the tickbox boolean or it'll crash it
    if (req.body.forceUser === "on") {
        req.body.forceUser = true;
    } else {
        req.body.forceUser = false;
    }//Update the character in the database
    await characters.findByIdAndUpdate(req.params.characterId, req.body);
    res.redirect(`/characters/${req.params.characterId}`);
})



// Export Router
module.exports = router