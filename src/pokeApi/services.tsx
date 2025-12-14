const api = "https://pokeapi.co/api/v2/";

async function getAllPokemon() {
  const response = await fetch(`${api}pokemon?limit=151`);
  const data = await response.json();
  return data.results;
}

async function getPokemonById(id: number) {
    try {
        const response = await fetch(`${api}pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        return null;
    }
}


export { getAllPokemon, getPokemonById };