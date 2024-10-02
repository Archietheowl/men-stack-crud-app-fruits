//Requirements
const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const methodOverride = require("method-override");
const session = require('express-session');
const MongoStore = require("connect-mongo");
require('dotenv/config');



//Middleware functions
const isSignedIn = require('./middleware/is-signed-in.js')
const passUserToView = require('./middleware/pass-user-to-view.js');
const allowErrors = require('./middleware/allow-errors.js')
const initFlashMessages = require('./middleware/init-flash-messages.js')

//* Routers/Controllers
const charactersRouter = require('./controllers/characters-controller.js')
const authRouter = require('./controllers/auth.js')

// Variables
const app = express()
const port = 3000


//Middleware
//INFO NOTE --- Middleware will always either send a response or next. Some might do either depending on circumstance
app.use(methodOverride("_method"));
app.use(express.urlencoded({ extended: false }))
app.use(express.static('public'));//Testing every single request to check if there's a mach in public folder
app.use(morgan('dev'))
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
    }),
}));
app.use('/auth', authRouter)

// Pass flash messages to the view
app.use(initFlashMessages)

//MUST COME UNDER THE SESSION MIDDLEWARE
app.use(passUserToView);
// app.use(isSignedIn);
app.use('/characters-controller', charactersRouter)



// Route Handlers
//* Landing Page
app.get('/', (req, res) => {
    res.render('index.ejs');
});

// VIP ROUTE JUST FOR EXAMPLE
app.get('/vip-lounge', (req, res) => {
    if (req.session.user) {
        res.send(`Welcome to the party ${req.session.user.username}.`)
    } else {
        res.send("Sorry, no guests allowed.")
    }
})

//* Routers
app.use('/auth', authRouter)
app.use('/characters', charactersRouter)


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
            console.log(`Server up and running on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServers()

///////TRY TO GET IN THE HABBIT OF THIS ALWAYS BEING YOUR FIRST STEP TO CHECK THE ROUTE IS WORKING
// app.delete('/characters/:characterId', (req, res) => {
//     res.send('This is the delete route');
// });
