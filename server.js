const express = require('express')
const morgan = require('morgan')
const mongoose = require('mongoose')
const methodOverride = require("method-override")
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

app.use(express.static('public'));//Testing every single request to check if there's a mach in public folder
app.use(morgan('dev'))
app.use(methodOverride("_method"));


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
      return res.redirect('/characters/')
  }catch{
    return res.status(500).send('Something went wrong')

  }
})

//Character Index Route
app.get("/characters", async (req, res) => {
    try{
        const allCharacters = await SWCharacter.find();
        return res.render("characters/index.ejs", { characters: allCharacters });

    }catch{                         //CHECK IF THIS IS THE CORRECT CODE
        return res.status(500).send('Something went wrong')
    }

})

// //Show ROUTE
// // Always make sure that a route with something like an id goes after other routes so it doesn't catch them by accident!
app.get("/characters/:characterId", async (req, res, next) => {
    try {
        if(mongoose.Types.ObjectId.isValid(req.params.characterId)){
            const foundCharacter = await SWCharacter.findById(req.params.characterId);
            if (!foundCharacter) return next()
            return res.render("characters/show.ejs", { character: foundCharacter });
            
        }else{
            next()
        } 
    }catch(error){
        console.log(error)
        return res.status(500).send('Something went wrong2')
    }
});

// Delete ROUTE
app.delete('/characters/:characterId', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(req.params.characterId)){
        await SWCharacter.findByIdAndDelete(req.params.characterId);
    } else { 
       next() 
    }
    res.redirect('/characters');
});

//Update Form Page GET ROUTE
 app.get('/characters/:characterId/edit', async (req, res) => {
    if (mongoose.Types.ObjectId.isValid(requ.params.characterId)){
        const foundCharacter = await SWCharacter.findById(req.params.characterId)
    } else {
        next()
    }
    res.render("characters/edit.ejs", {
        character: foundCharacter,
    })
});
//Update Route path
app.put('/characters/:characterId', async (req, res) => {
    //Have to handle the tickbox boolean or it'll crash it
    if (req.body.forceUser === "on") {
        req.body.forceUser = true;
    } else {
        req.body.forceUser = false;
    }//Update the character in the database
    await SWCharacter.findByIdAndUpdate(req.params.characterId, req.body);
    res.redirect(`/characters/${req.params.characterId}`);
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