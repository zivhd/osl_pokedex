const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;

// EJS setup
app.set('view engine', 'ejs');
app.set('views', './views');

// Static files
app.use(express.static('public'));
app.use(express.static('scripts'));

// Routes
app.get('/loadMore/:offset/:limit', async (req, res) => {
    try {
        const { offset, limit } = req.params;
        const pokemons = await fetchPokemons(parseInt(offset), parseInt(limit));
        const pokemonDataPromises = pokemons.map(pokemon => fetchPokemonData(pokemon.url));

        const pokemonData = await Promise.all(pokemonDataPromises);

        const pokemons_with_data = pokemons.map((pokemon, index) => ({
            ...pokemon,
            data: pokemonData[index]
        }));

        res.json({ pokemons_with_data });
    } catch (error) {
        console.error('Error fetching Pokemons:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

  app.get('/', async (req, res) => {
    try {
      const pokemons = await fetchPokemons(0, 10);
      const pokemonDataPromises = pokemons.map(pokemon => fetchPokemonData(pokemon.url));
      
 
      const pokemonData = await Promise.all(pokemonDataPromises);
  
      const pokemons_with_data = pokemons.map((pokemon, index) => ({
        ...pokemon,
        data: pokemonData[index]
      }));

      res.render('index', { pokemons_with_data });
    } catch (error) {
      console.error('Error fetching Pokemons:', error);
      res.status(500).send('Internal Server Error');
    }
  });


async function fetchPokemons(offset, limit) {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`);
      return response.data.results;
    } catch (error) {
      throw error;
    }
  }
  
  async function fetchPokemonData(url) {
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      throw error;
    }
  }

// Start server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
