let pokemonData;
let speciesData;
let pokemonColor;
let isClicked = false;

const dropdownContainer = document.querySelector('.dropdownContainer');
const pokemonSelector = document.querySelector('#pokemonSelector');

const pokemonCard = document.querySelector('.pokemonCard');
const extraInfoBtn = document.querySelector('.moreInfoButton');

const pokemonImage = document.querySelector('.image');
const typeBadge = document.querySelector('.typeBadge');

const pokemonName = document.querySelector('.pokemonName');
const statHealth = document.querySelector('.statHealth');
const statMainAbility = document.querySelector('.statMainAbility');
const statHabitat = document.querySelector('.statHabitat');
const statPower = document.querySelector('.statPower');
const statCaptureRate = document.querySelector('.statCaptureRate');
const statFriendliness = document.querySelector('.statFriendliness');

const statHeight = document.querySelector('.statHeight');
const statWeight = document.querySelector('.statWeight');
const statHiddenAbility = document.querySelector('.statHiddenAbility');
const statSpeed = document.querySelector('.statSpeed');

let finalPokemon = pokemonSelector.value;

// Fetch both data sources using Promise.all for parallel fetching
async function fetchPokemonData(pokemonName) {
    try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${finalPokemon}`).then(res => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${finalPokemon}`).then(res =>
                res.json()
            ),
        ]);

        pokemonData = pokemonResponse;
        speciesData = speciesResponse;

        console.log(pokemonData);
        console.log(speciesData);
        
        updatePokemonUI();
    } catch (error) {
        console.log('Erro fetching data', error);
        pokemonName.textContent = 'Error loading pokemon';
    }
}

const updatePokemonUI = () => {
    if (!pokemonData || !speciesData) return;

    pokemonImage.src = pokemonData.sprites.other['official-artwork'].front_default;
    typeBadge.textContent = pokemonData.types[0].type.name;
    pokemonName.textContent = pokemonData.name;

    statHealth.textContent = pokemonData.stats[0].base_stat;
    statMainAbility.textContent = pokemonData.abilities[0].ability.name;
    statSpeed.textContent = pokemonData.stats[5].base_stat;
    statHeight.textContent = pokemonData.height / 10 + 'm';
    statWeight.textContent = pokemonData.weight / 10 + 'kg';
    statCaptureRate.textContent = speciesData.capture_rate + '/255';
    statFriendliness.textContent = speciesData.base_happiness + '/255';

    // Handle hidden ability
    const hasHiddenAbility = pokemonData.abilities.find(ability => ability.is_hidden === true);
    if (hasHiddenAbility) {
        statHiddenAbility.textContent = hasHiddenAbility.ability.name;
    }
    const baseStatTotal = pokemonData.stats.reduce((total, stat) => total + stat.base_stat, 0);
    statPower.textContent = baseStatTotal;

    pokemonColor = speciesData.color.name;

    pokemonCard.style.backgroundColor = pokemonColor;
    dropdownContainer.style.backgroundColor = pokemonColor;
    pokemonSelector.style.backgroundColor = pokemonColor;
    statHabitat.textContent = speciesData.habitat?.name || 'Unknown';
};

extraInfoBtn.addEventListener('click', () => {
    isClicked = !isClicked;
    pokemonCard.style.height = isClicked ? '580px' : '480px';
});

pokemonSelector.addEventListener('change', event => {
    finalPokemon = event.target.value;
    fetchPokemonData(finalPokemon);
});

fetchPokemonData(finalPokemon);
