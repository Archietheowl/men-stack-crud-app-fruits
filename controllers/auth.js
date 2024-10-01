// Router
const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')

// Model
const User = require('../models/user.js')

// Routers/Controllers
//**************************Each route is already prepended with '/auth' */
// Sigun Up Form
//Method: GET
//Path: /auth/sign-up
router.get('/sign-up', (req, res) => {
    return res.render('auth/sign-up.ejs')
})

// *-- Create User
router.post('/sign-up', async(req, res) => {
    try {
        // check that the password and confirmPassword entries match. If not send message
        if (req.body.password !== req.body.confirmPassword) {
            return res.send(422).send("Passord and Confirm Password must match")
        }
        // if the username is available and the password entires match, HASH THE PASSORD
        req.body.password = bcrypt.hashSync(req.body.password, 10)
        // After password checks attempt to create user
        const newUser = await User.create(req.body);
        return res.redirect('/auth/sign-in')
    } catch(error){
        console.log(error)
        if(error.code === 11000){
            const unique = Object.entries(error.keyValue)[0]
            return res.status(422).send(`${unique[0]} "${unique[1]}" already taken`)
        }
        return res.status(500).send("<h1>An error</h1>")
    }
})

// *-- Sign In Form
router.get("/sign-in", (req, res) => {
    res.render("auth/sign-in.ejs");
});


// *-- Sign In User
router.post("/sign-in", async (req, res) => {
    try{
        //Check a user exists with the given username
        const userInDatabase = await User.findOne({ username: req.body.username})
        // Invalidate the request with an "Unauthorized" status if the username is not 
        if(!userInDatabase){
            return res.send('Login failed. Please try again.')
        }
        // If passwords do not match send an identical response to the 401 above
        const validPassword = bcrypt.compareSync(
            req.body.password,
            userInDatabase.password
        );
        if (!validPassword){
            return res.send('Login failed. Please try again.')          
        }

        // Create a session to sign the user in
        req.session.user = {
            username: userInDatabase.username,
        };
        return res.redirect('/');

    } catch(error) {
    console.log(error)
    return res.status(500).send('<h1>An error occured</h1>')
    }
});

//Sign Out Route
router.get('/sign-out', (req, res) => {
    req.session.destroy();
    res.redirect("/")
})

// *-- Export the Router
module.exports = router