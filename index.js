// 1 - Enviroment
require('dotenv').config();

// 2 - Imports
const express = require('express');
const ejsLayouts = require('express-ejs-layouts');
const methodOverride = require('method-override');
const axios = require('axios');
const {
    render
} = require('ejs');
const db = require('./models')

// 3 - App set up
const app = express();
app.set('view engine', 'ejs');

// 4 - App Middlewhere (app.use)
app.use(express.static(__dirname + '/public/'))
app.use(ejsLayouts);
app.use(express.urlencoded({
    extended: false
}));
app.use(methodOverride('_method'));

// 5 - Routes (controllers)
app.get('/pokemon', function(req, res) {
    let pokemonUrl = 'http://pokeapi.co/api/v2/pokemon/?limit=151';
    // Use request to call the API
    axios.get(pokemonUrl).then( function(apiResponse) {
      let pokemon = apiResponse.data.results;
      console.log(pokemon)
      res.render('index', { pokemon: pokemon.slice(0, 151) });
    })
  });

// app.get('/pokemon', (req, res) => {
//     res.render('show', {})
// })

app.post('/pokemon', (req, res) => {

    const favPokemon = req.body
  
    db.pokemon.findOrCreate({
      where: {
        name: favPokemon.name
      }
    })
    .then(([pokedex, didCreate])=> {
      if(didCreate) {
        console.log(pokedex)
      }
      res.redirect('/pokemon')
    })
    .catch( (err)=> {
      console.log(err)
    })
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on PORT:${PORT}`)
})