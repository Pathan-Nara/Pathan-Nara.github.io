import { useEffect, useState } from 'react'
import { getPokemonById } from './pokeApi/services'
import { getCatchRate, getGenderRate, getMaxHP } from './tyradex/services';
import { FaHeart, FaRegHeart, FaBell  } from "react-icons/fa";
import { dataStorage } from './storage/datastorage';

import './App.css'

interface Pokemon {
  name: string;
  maxHp: number;
  img: string;
  sound: string;
  type: [string];
  gender?: string | null;
  catchRate: number;
  shiny?: boolean;
  favorite?: boolean;
}



function App() {
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [pokemonTeam, setPokemonTeam] = useState<Pokemon[]>(dataStorage.loadTeam());
  const [showModal, setShowModal] = useState<boolean>(false);
  const [showModalFavorites, setShowModalFavorites] = useState<boolean>(false);
  const [counter, setCounter] = useState<number>(0);
  const [userFavorite, setUserFavorite] = useState<Pokemon[]>(dataStorage.loadFavorites());
  const [isCapturing, setIsCapturing] = useState<boolean>(false);
  const [captureResult, setCaptureResult] = useState<'success' | 'fail' | null>(null);

  useEffect(() => {
    console.log("Counter depuis le useEffect:", counter);
    if(counter === 3 && !isCapturing){
      console.log("Compteur à 3, le pokemon s'enfuit");
      getRandomPokemon();
      setCounter(0);
    }
  }, [counter, pokemonTeam, isCapturing]);

  function dropRate(rate: number) {
      const randomNum = Math.random() * 100;
      console.log("Random Number:", randomNum, "Rate:", rate, randomNum <= rate);
      return randomNum <= rate;
    }
  
  function generateMessage(hpFactor: number, ball: number, pokemon: Pokemon) {
    console.log(`Tentative de capture de ${pokemon.name} : HP Factor = ${hpFactor.toFixed(2)}, Ball Roll = ${ball.toFixed(2)}`);
  }

  function capture(pokemon: Pokemon, ballRate: number = 255) { //le taux de capture de la safari ball est de 150 de base (comme on est dans un safari) mais bon vu que la safari ball a le meme taux de capture que la hyper ball on va mettre le taux de capture de la pokeball pour rendre le jeu plus difficile mueheheh (PS c'est la vrai formule de capture sauf que on prends pas en compte les status du pokemon, les pv et tout le tralala donc la c'est comme si on essayait de capturer un pokemon au premier lancer)
    setCounter(prev => prev + 1);   //source : https://www.dragonflycave.com/mechanics/gen-i-capturing/
    console.log("Capture function called. Counter:", counter + 1);
    const R1 = Math.floor(Math.random() * (ballRate + 1));
    const hpFactor = Math.floor(Math.min((((pokemon.maxHp * 255)/12)/(pokemon.maxHp/4)), 255));

    if(R1 >= pokemon.catchRate){
      generateMessage(hpFactor, R1, pokemon);
      return false;
    }
    else{
      const R2 = Math.floor(Math.random() * 256);
      if(R2<=hpFactor){
        return true;
      }
      else{
        generateMessage(hpFactor, R2, pokemon);
        return false;
      }
    }
  }

  function tauxCapture(pokemon: Pokemon, ballRate: number = 255) {
    const hpFactor = Math.floor(Math.min((((pokemon.maxHp * 255)/12)/(pokemon.maxHp/4)), 255));
    const probaR1 = pokemon.catchRate / (ballRate + 1);
    const probaR2 = hpFactor / 256;
    const totalProba = probaR1 * probaR2;
    return (totalProba * 100).toFixed(2);
  }


  function playSound(url: string) {
    const audio = new Audio(url);
    audio.play();
  }

  function isShiny(): boolean {
    const shinyChance = 512; 
    const randomNum = Math.floor(Math.random() * shinyChance);
    return randomNum === 0;
  }

  function isFavorite(pokemonName: string): boolean {
    return userFavorite.some(fav => fav.name === pokemonName);
  }

  function toggleFavorite(poke: Pokemon) {
    if (isFavorite(poke.name)) {
      removeFromFavorites(poke);
      if (pokemon?.name === poke.name) {
        setPokemon({...pokemon, favorite: false});
      }
    } else {
      addToFavorites(poke);
      if (pokemon?.name === poke.name) {
        setPokemon({...pokemon, favorite: true});
      }
    }
  }

  function addToFavorites(pokemon: Pokemon) {
    if(!userFavorite.some(fav => fav.name === pokemon.name)) {
      const newFavorites = [...userFavorite, pokemon];
      setUserFavorite(newFavorites);
      dataStorage.saveFavorites(newFavorites);
    } else {
      return;
    }
  }

  function removeFromFavorites(pokemon: Pokemon) {
    const newFavorites = userFavorite.filter(fav => fav.name !== pokemon.name);
    setUserFavorite(newFavorites);
    dataStorage.saveFavorites(newFavorites);
  }

  async function getRandomPokemon() {
    const randomId = Math.floor(Math.random() * 151) + 1;
    const pokemonData = await getPokemonById(randomId);

    const catch_rate = await getCatchRate(randomId);
    const maxHp = await getMaxHP(randomId);
    const shiny = isShiny();
    if (shiny) {
      console.log("Un shiny est apparu !");
    }
    const genders = await getGenderRate(randomId);

    let isMale: string | null = null;

    if (genders === null){
      isMale = 'Pas de sexe';
    }
    else if (genders.male === 0){
      isMale = 'female';
    } else{
      isMale = dropRate(genders.male) ? 'male' : 'female';
    }
    
    const pokemon: Pokemon = {
      name: pokemonData.name,
      maxHp: maxHp,
      img: shiny ? pokemonData.sprites.front_shiny : pokemonData.sprites.front_default,
      sound: pokemonData.cries.latest,
      type: pokemonData.types.map((typeInfo: any) => typeInfo.type.name),
      catchRate: catch_rate,
      gender: isMale,
      shiny: shiny,
      favorite: userFavorite.some(fav => fav.name === pokemonData.name),
    };

    playSound(pokemon.sound);
        
    setPokemon(pokemon);
  }


  const modalReplace = 
  <>
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <button className='close-button' onClick={() => { setShowModal(false); getRandomPokemon(); }} aria-label="Fermer">&times;</button>
        </div>
        <div className='modal-body'>
          <h2>Équipe Complète!</h2>
          <p>Vous ne pouvez pas capturer plus de 6 Pokémon veuillez en retirer un.</p>
          <div className="grid">
              {pokemonTeam.map((poke, index) => (
                <div key={index} className='pokemon'>
                  <h2>{poke.name}</h2>
                  <img src={poke.img} alt={poke.name} />
                  <button onClick={() => {
                    const newTeam = pokemonTeam.filter((_, i) => i !== index);
                    setPokemonTeam(newTeam);
                    setShowModal(false);
                    console.log("Relâché:", pokemon);
                    if (newTeam.length < 6 && pokemon) {
                      const finalTeam = [...newTeam, pokemon];
                      setPokemonTeam(finalTeam);
                      dataStorage.saveTeam(finalTeam);
                    }
                    getRandomPokemon();
                  }}>Relâcher</button>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  </>

  const favoriteModal = 
  <>
    <div className='modal'>
      <div className='modal-content'>
        <div className='modal-header'>
          <button className='close-button' onClick={() => { setShowModalFavorites(false); }} aria-label="Fermer">&times;</button>
        </div>
        <div className='modal-body'>
          <h2>Pokémon Favoris</h2>
          <div className="grid">
              {userFavorite.map((poke, index) => (
                <div key={index} className='pokemon'>
                  <h2>{poke.name}</h2>
                  <img src={poke.img} alt={poke.name} />
                  <div className='fav-btn'>
                    <button onClick={() => {
                      toggleFavorite(poke);
                    }}>
                      {isFavorite(poke.name) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                </div>
              ))}
            </div>
        </div>
      </div>
    </div>
  </>


   
  return (
    <>
      {showModal && modalReplace }
      {showModalFavorites && favoriteModal }
      <div className="App">
        <div className="header">
          <div className='top'>
            <button className='show-favorites' onClick={() => setShowModalFavorites(true)}><FaHeart /></button>
            <h1>PokéSim</h1>
            <button className='notif-btn'><FaBell /></button>
          </div>
          <button onClick={() => { getRandomPokemon(); console.log("Random Pokémon generated"); console.log(pokemon)}}>Rencontre</button>
        </div>          
          {pokemon && (

            <>
            <div className="pokemon-display">
              <div className="fav-btn">
                <button 
                  onClick={() => {
                    if (isFavorite(pokemon.name)) {
                      toggleFavorite(pokemon);
                    } else {
                      toggleFavorite(pokemon);
                    }
                  }}
                >
                  {isFavorite(pokemon.name) ? <FaHeart /> : <FaRegHeart />}
                </button>
              </div>
              <div className="pokemon-info">
                <h2>{pokemon.name}</h2>
                <div className="pokemon-sprite-container">
                  <div className={`poke-sprite ${isCapturing ? 'leaving' : ''}`} key={pokemon.name + pokemon.img}>
                    <img src={pokemon.img} alt={pokemon.name} />
                  </div>
                  {isCapturing && captureResult && (
                    <div className="pokeball-overlay">
                      <img 
                        src="src/assets/img/safariball.png" 
                        alt="Pokeball" 
                        className={`pokeball-capture ${captureResult}`}
                      />
                    </div>
                  )}
                </div>
                <p>Type: {pokemon.type.join(', ')}</p>
                <p>Taux de capture: {tauxCapture(pokemon) + '%'}</p>
                <p>Genre: {pokemon.gender}</p>
              </div>
            </div>
            </>
          )}
        {(pokemon && !isCapturing) && (
          <div className="capture-section">
            <button onClick={async () => {
              const captureSuccess = capture(pokemon, 255);
              
              
              setIsCapturing(true);
              await new Promise(resolve => setTimeout(resolve, 500)); 
              
              setCaptureResult(captureSuccess ? 'success' : 'fail');
              await new Promise(resolve => setTimeout(resolve, 1500)); 
              
              if(captureSuccess) {
                
                await new Promise(resolve => setTimeout(resolve, 300)); 
                
                if (pokemonTeam.length < 6) {
                  setPokemonTeam([...pokemonTeam, pokemon]);
                  dataStorage.saveTeam([...pokemonTeam, pokemon]);
                  getRandomPokemon();
                } else {
                  setShowModal(true);
                }
              } else {
                
                await new Promise(resolve => setTimeout(resolve, 300)); 
                console.log("Missed!");
              }
              
              
              setIsCapturing(false);
              setCaptureResult(null);
              
              
              if (counter === 3) {
                getRandomPokemon();
                setCounter(0);
              }
            }}>Capture</button>
          </div>
        )}

        <div className="pokemon-team-section">
          <h1>Pokemon Capturé :</h1>
          <div className="pokemon-team">
            {pokemonTeam.map((poke, index) => (
              <div key={index} className="team-pokemon">
                <div className='top-pokemon-team'>
                  <div className='fav-btn'>
                    <button onClick={() => {
                      toggleFavorite(poke);
                    }}>{isFavorite(poke.name) ? <FaHeart /> : <FaRegHeart />}
                    </button>
                  </div>
                </div>
                <h2>{poke.name}</h2>
                <img src={poke.img} alt={poke.name} />
                <button onClick={() => {
                  const newTeam = pokemonTeam.filter((_, i) => i !== index);
                  setPokemonTeam(newTeam);
                }}>Relâcher</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}




export default App
