const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
const session = require('express-session')
require('dotenv/config')

//* Routers/Controllers
const charactersRouter = require('./controllers/characters-controller.js')
// think this is redundant:::::::const authRouter = require('./controllers/auth.js')

// Variables
const app = express()
const port = 3000
const authController = require('./controllers/auth.js')


//Middleware

app.use(express.static('public'));//Testing every single request to check if there's a mach in public folder
app.use(morgan('dev'))
app.use(methodOverride("_method"));
app.use('/characters', charactersRouter)
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, //stops it resaving over and over even if there are no changes.
    saveUninitialized: true // will create a session that does not currently exist in our story
}))


// Route Handlers

//* Landing Page
app.get('/', (req, res) => {
    res.render('index.ejs', {
        user: req.session.user,
    });
});

//* Routers
app.use('/auth', authController)
app.use('/characters', charactersRouter)

// VIP ROUTE JUST FOR EXAMPLE
app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`)
    } else {
        res.send("Sorry, no guests allowed.")
    }
})

///////TRY TO GET IN THE HABBIT OF THIS ALWAYS BEING YOUR FIRST STEP TO CHECK THE ROUTE IS WORKING
// app.delete('/characters/:characterId', (req, res) => {
//     res.send('This is the delete route');
// });

// 404 Handler
app.get('*', (req, res) => {
    return res.status(404).render('404.ejs')
})

// Server Connections
const startServers = async () => {
    try {
        // Database connection
        await mongoose.connect(process.env.MONGODB_URI)
        console.log('Database connection established')

        //Server Connection
        app.listen(port, () => {
            console.log(`Server up and runnong on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServers()