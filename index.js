const axios = require('axios');
const express = require('express');
const app = express();
const port = 3000;
app.set('view engine', 'ejs');
app.set('views', './views');
app.use(express.static('public'));
app.use(express.static('scripts'));

const cache = {};
app.get('/search/:term', async (req, res) => {
    try {
        const { term } = req.params;
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=1000'); // super ugly way to search
        const allPokemons = response.data.results;

        const matchingPokemons = allPokemons.filter(pokemon => pokemon.name.includes(term.toLowerCase()));

        const pokemonDataPromises = matchingPokemons.map(pokemon => fetchPokemonData(pokemon.url));
        const pokemonData = await Promise.all(pokemonDataPromises);

        const pokemons_with_data = matchingPokemons.map((pokemon, index) => ({
            name: pokemon.name,
            data: pokemonData[index]
        }));

        res.json({ pokemons_with_data });
    } catch (error) {
        console.error('Error searching Pokemons by name:', error);
        res.status(404).json({ error: 'Pokemons not found' });
    }
});

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
