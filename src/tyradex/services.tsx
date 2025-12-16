const api = "https://tyradex.vercel.app/api/v1/";

async function getCatchRate(id: number) {
    try {
        const response = await fetch(`${api}pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.catch_rate);
        return data.catch_rate;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        return null;
    }
}

async function getGenderRate(id: number) {
    try {
        console.log("Fetching");
        const response = await fetch(`${api}pokemon/${id}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.sexe);
        console.log(data);
        return data.sexe;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        return null;
    }
}

async function getMaxHP(id: number) {
    try {
        const response = await fetch(`${api}pokemon/${id}`);;
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log(data.stats);
        const hpStat = data.stats.hp
        return hpStat;
    } catch (error) {
        console.error("Failed to fetch Pokémon data:", error);
        return null;
    }
}

export { getCatchRate, getGenderRate, getMaxHP };