import { useState } from 'react'
import { getAllPokemon, getPokemonById } from './pokeApi/services'
import { getCatchRate, getGenderRate } from './tyradex/services';
import './App.css'

interface Pokemon {
  name: string;
  img: string;
  sound: string;
  type: [string];
  gender?: string | null;
  catchRate?: number;
}


function App() {
  
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isShiny, setIsShiny] = useState<boolean | null>(null);
  const [isCaught, setIsCaught] = useState<boolean | null>(null);

  function dropRate(rate: number) {
      const randomNum = Math.random() * 100;
      console.log("Random Number:", randomNum, "Rate:", rate, randomNum <= rate);
      return randomNum <= rate;
    }

  async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const pokemonData = await getPokemonById(randomId);

    const catch_rate = await getCatchRate(randomId);
    const genders = await getGenderRate(randomId);

    let isMale: string | null = null;

    if (genders === null){
      console.log("pas de sexe", genders);
      isMale = 'Pas de sexe';
    }
    else if (genders.male === 0){
      console.log("femelle uniquement", genders);
      isMale = 'female';
    } else{
      console.log("male ou femelle", genders);
      isMale = dropRate(genders.male) ? 'male' : 'female';
    }
    
    const pokemon: Pokemon = {
      name: pokemonData.name,
      img: pokemonData.sprites.front_default,
      sound: pokemonData.cries.latest,
      type: pokemonData.types.map((typeInfo: any) => typeInfo.type.name),
      catchRate: catch_rate,
      gender: isMale,
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
              <p>Catch Rate: {pokemon.catchRate}</p>
              <p>Gender: {pokemon.gender}</p>
            </>
          )}
        </div>
      </div>
    </>
  )
}

export default App
