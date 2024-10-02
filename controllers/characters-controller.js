// Imports / Requirements
const mongoose = require('mongoose')
const express = require('express')

// Router
const router = express.Router()

// Model
const characters = require ('../models/starWarsEp1.js')


//Middleware Functions
const isSignedIn = require('../middleware/is-signed-in.js')


// Routes
// Remeber that each ROUTE is already prepended with "characters"

//Character Index Route
router.get("/", async (req, res) => {  //This route is "/" because it's prepended and it's name is index
    try {
        const allCharacters = await characters.find();
        console.log(allCharacters)
        return res.render('characters/index.ejs', { allCharacters })
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occured.</h1>')
    }
})

//New Page (form page)                     
router.get("/new", isSignedIn, (req, res) => {
    res.render("characters/new.ejs");
})

// //Show Page 
// // Always make sure that a route with something like an id goes after other routes so it doesn't catch them by accident!
router.get('/:characterId', async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
            const foundCharacter = await characters.findById(req.params.characterId).populate('creator').populate('comments.user')
            if (!foundCharacter) return next()
            return res.render('characters/show.ejs', { character: foundCharacter });
        } else {
            next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})


// Create Route (sending the data from the body of new.ejs to the db creating a new doc)
router.post('/', isSignedIn, async (req, res) => {
    try {
        req.body.creator = req.session.user._id 
        const character = await characters.create(req.body)
        return res.redirect('/characters')
    } catch (error) {
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})


// Delete ROUTE
router.delete('/:characterId', async (req, res) => {
    try {
        const characterToDelete = await characters.findById(req.params.characterId)

        if (characterToDelete.creator.equals(req.session.user._id)) {
            const deletedCharacter = await characters.findByIdAndDelete(req.params.characterId)
            return res.redirect('/characters')
        }
        throw new Error('User is not authorised to perform this action')
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})
//Update Form Page GET ROUTE
router.get('/:characterId/edit', isSignedIn, async (req, res, next) => {
    try {
        if (mongoose.Types.ObjectId.isValid(req.params.characterId)) {
            const character = await characters.findById(req.params.characterId)
            if (!character) return next()

            if (!character.creator.equals(req.session.user._id)) {
                return res.redirect(`/characters/${req.params.characterId}`)
            }
            return res.render('characters/edit.ejs', { character })
        }
        next()
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})

//Update Route path
router.put('/:characterId', isSignedIn, async (req, res) => {
    try {
        const characterToUpdate = await characters.findById(req.params.characterId)

        if (characterToUpdate.creator.equals(req.session.user._id)) {
            const updatedCharacter = await characters.findByIdAndUpdate(req.params.characterId, req.body, { new: true })
            return res.redirect(`/characters/${req.params.characterId}`)
        }
        throw new Error('User is not authorised to perform this action')
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred.</h1>')
    }
})

// * -- Create Comment
router.post('/:characterId/comments', async (req, res, next) => {
    try {

        // Add signed in user id to the user field
        req.body.user = req.session.user._id

        // Find the event that we want to add the comment to
        const character = await characters.findById(req.params.characterId)
        if (!character) return next() // send 404

        // Push the req.body (new comment) into the comments array
        character.comments.push(req.body)

        // Save the event we just added the comment to - this will persist to the database
        await character.save()

        return res.redirect(`/characters/${req.params.characterId}`)
    } catch (error) {
        req.session.message = error.message

        req.session.save(() => {
            return res.redirect(`/characters/${req.params.characterId}`)
        })
    }
})
// * -- Delete Comment
router.delete('/:characterId/comments/:commentId', async (req, res, next) => {
    try {
        const character = await characters.findById(req.params.characterId)
        if (!character) return next()

        // Locate comment to delete
        const commentToDelete = character.comments.id(req.params.commentId)
        console.log(commentToDelete)
        if (!commentToDelete) return next()

        // Delete comment (this does not make a call to the db)
        commentToDelete.deleteOne()

        // Persist changed to database (this does make a call to the db)
        await character.save()

        // Redirect back to show page
        return res.redirect(`/characters/${req.params.characterId}`)
    } catch (error) {
        console.log(error)
        return res.status(500).send('<h1>An error occurred</h1>')
    }
})


// Export Router
module.exports = router