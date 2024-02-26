
document.addEventListener('DOMContentLoaded', () => {
    const loadMoreBtn = document.getElementById('loadMoreBtn');
    const pokemonListContainer = document.getElementById('pokemonList');
    let offset = 10; 

    loadMoreBtn.addEventListener('click', async () => {
        try {
            const response = await axios.get(`/loadMore/${offset}/10`);
            const newPokemonsWithData = response.data.pokemons_with_data;

            newPokemonsWithData.forEach(pokemon => {
                const pokemonCard = document.createElement('div');
                pokemonCard.className = 'bg-white rounded-lg p-4 shadow-md';
            
           
                const image = document.createElement('img');
                image.className = 'mx-auto mb-4';
                image.src = `https://assets.pokemon.com/assets/cms2/img/pokedex/full/${pokemon.data.id.toString().padStart(3, '0')}.png`;
                image.alt = pokemon.name;
                pokemonCard.appendChild(image);
            
              
                const name = document.createElement('p');
                name.className = 'text-2xl';
                name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
                pokemonCard.appendChild(name);
            
         
                const id = document.createElement('p');
                id.className = 'text-lg mb-2';
                id.textContent = `#${pokemon.data.id.toString().padStart(3, '0')}`;
                pokemonCard.appendChild(id);
            

                const typesContainer = document.createElement('div');
                typesContainer.className = 'grid grid-cols-2 gap-4';
            

                pokemon.data.types.forEach(type => {
                    const typeElement = document.createElement('div');
                    typeElement.className = 'bg-gray-300 rounded-lg p-1 shadow-md text-center';
                    typeElement.textContent = type.type.name;
                    typesContainer.appendChild(typeElement);
                });
            
                pokemonCard.appendChild(typesContainer);
            

                pokemonListContainer.appendChild(pokemonCard);
            });
            

            offset += 10;
        } catch (error) {
            console.error('Error loading more Pokemons:', error);
        }
    });
});
