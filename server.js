const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
require('dotenv/config')

//Models
const SWCharacter = require('./models/starWarsEp1.js')


// Variables
const app = express()
const port = 3000


//Middleware
app.use(express.urlencoded({ extended: false }))
// app.use((req, res, next) => {
//     console.log(req.get('Content-Type'))
//     next()
// })
app.use(express.static('public'));
app.use(morgan('dev'))



// Route Handlers
// Landing Page Route
app.get("/", (req, res) => {
    res.render('index.ejs')
})

//New Page (form page)                     
app.get("/characters/new", (req, res) => { 
    res.render("characters/new.ejs");
})

// Create Route
app.post("/characters", async (req, res) => {
  try{
      if (req.body.forceUser === 'on') {
          req.body.forceUser = true
      } else {
          req.body.forceUser = false
      }
//   req.body.isReadyToEat = !!req.body.isReadyToEat  (A shorter method of converting to boolean value)
      const character = await SWCharacter.create(req.body)
      return res.redirect('/characters/new')
  }catch{
    return res.status(500).send('Something has gone wrong')

  }
})

//Character Index Route????????????????????????????Something in this route has broken it
app.get("/characters", async (req, res) => {
    try{
        const allCharacters = await SWCharacter.find();
        res.render("characters/index.ejs", { characters: allCharacters });

    }catch{                         //CHECK IF THIS IS THE CORRECT CODE
        return res.status(500).send('Something has gone wrong')
    }

})

// //Show Character Page  
// // Always make sure that a route with something like an id goes after other routes so it doesn't catch them by accident!
// app.get("/characters/:characterId", async (req, res) => {
//     const foundCharacter = await SWCharacter.findById(req.params.characterId);
//     res.render("characters/show.ejs", {character: foundCharacter});
// });

// 404 Handler
app.get('*', (req, res) => {
    return res.send('Page not found')
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