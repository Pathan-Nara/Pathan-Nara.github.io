import { useState } from 'react'
import { getAllPokemon, getPokemonById } from './pokeApi/services'
import './App.css'

interface Pokemon {
  name: string;
  img: string;
  sound: string;
  type: [string];
}


function App() {
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isShiny, setIsShiny] = useState<boolean | null>(null);
  const [maleorFemale, setMaleorFemale] = useState<boolean | null>(null);


  async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const pokemonData = await getPokemonById(randomId);
    const pokemon: Pokemon = {
      name: pokemonData.name,
      img: pokemonData.sprites.front_default,
      sound: pokemonData.cries.latest,
      type: pokemonData.types.map((typeInfo: any) => typeInfo.type.name),
    };
    setPokemon(pokemon);
  }

   
  return (
    <>
      <div className="App">
        <h1>PokéSim</h1>
        <button onClick={() => { getRandomPokemon(); console.log(pokemon); }}>Get Random Pokémon</button>
        <div className="pokemon-display">
          {pokemon && (
            <>
              <h2>{pokemon.name}</h2>
              <img src={pokemon.img} alt={pokemon.name} />
              <p>Type: {pokemon.type.join(', ')}</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
