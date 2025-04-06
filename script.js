let pokemonData;
let speciesData;
let pokemonColor;
let isClicked = false;
let optionsClicked = false;
let finalPokemon;

// DOM ELEMENTS
const dropdownContainer = document.querySelector('.dropdownContainer');
const pokemonSelector = document.querySelector('#pokemonSelector');
const pokemonCard = document.querySelector('.pokemonCard');

const optionsButton = document.querySelector('.optionsButton');
const extraInfoBtn = document.querySelector('.moreInfoButton');
const allPokemonOptions = document.querySelectorAll('.pokemonOption');

const pokemonImage = document.querySelector('.image');
const typeBadge = document.querySelector('.typeBadge');
const pokemonName = document.querySelector('.pokemonName');

// Main Stats
const statHealth = document.querySelector('.statHealth');
const statMainAbility = document.querySelector('.statMainAbility');
const statHabitat = document.querySelector('.statHabitat');
const statPower = document.querySelector('.statPower');
const statCaptureRate = document.querySelector('.statCaptureRate');
const statFriendliness = document.querySelector('.statFriendliness');

// Extra Stats
const statHeight = document.querySelector('.statHeight');
const statWeight = document.querySelector('.statWeight');
const statHiddenAbility = document.querySelector('.statHiddenAbility');
const statSpeed = document.querySelector('.statSpeed');

async function fetchPokemonData(pokemonName) {
    try {
        const [pokemonResponse, speciesResponse] = await Promise.all([
            fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`).then(res => res.json()),
            fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonName}`).then(res =>
                res.json()
            ),
        ]);

        pokemonData = pokemonResponse;
        speciesData = speciesResponse;

        updatePokemonUI();
    } catch (error) {
        console.log('Error fetching data', error);
        pokemonName.textContent = 'Error loading pokemon';
    }
}

const updatePokemonUI = () => {
    if (!pokemonData || !speciesData) return;

    pokemonImage.src = pokemonData.sprites.other['official-artwork'].front_default;
    pokemonName.textContent = capitalize(pokemonData.name);

    typeBadge.textContent = capitalize(pokemonData.types[0].type.name);

    statHealth.textContent = pokemonData.stats[0].base_stat;
    statMainAbility.textContent = capitalize(pokemonData.abilities[0].ability.name);
    statSpeed.textContent = pokemonData.stats[5].base_stat;
    statHeight.textContent = pokemonData.height / 10 + 'm';
    statWeight.textContent = pokemonData.weight / 10 + 'kg';
    statCaptureRate.textContent = speciesData.capture_rate + '/255';
    statFriendliness.textContent = speciesData.base_happiness + '/255';
    statHabitat.textContent = capitalize(speciesData.habitat?.name || 'Unknown');

    const hasHiddenAbility = pokemonData.abilities.find(ability => ability.is_hidden === true);
    if (hasHiddenAbility) {
        statHiddenAbility.textContent = capitalize(hasHiddenAbility.ability.name);
    }

    const baseStatTotal = pokemonData.stats.reduce((total, stat) => total + stat.base_stat, 0);
    statPower.textContent = baseStatTotal;

    // Update colors
    pokemonColor = speciesData.color.name;
    pokemonCard.style.backgroundColor = pokemonColor;
    dropdownContainer.style.backgroundColor = pokemonColor;
    optionsButton.style.backgroundColor = pokemonColor;
    pokemonSelector.style.backgroundColor = pokemonColor;
};

// helper for uppercase letters
const capitalize = string => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// EVENT HANDLERS
const handleExtraInfoToggle = () => {
    extraInfoBtn.addEventListener('click', () => {
        isClicked = !isClicked;
        pokemonCard.style.height = isClicked ? '580px' : '470px';
    });
};

const handleOptionsChange = () => {
    optionsButton.addEventListener('change', event => {
        finalPokemon = event.target.value;
        fetchPokemonData(finalPokemon);
    });
};

const handleOpenOptions = () => {
    optionsButton.addEventListener('click', () => {
        if (optionsClicked) {
            pokemonSelector.style.display = 'none';
            optionsClicked = false;
        } else {
            pokemonSelector.style.display = 'flex';
            optionsClicked = true;
        }
    });
};

const handleChosingPokemon = () => {
    allPokemonOptions.forEach(option => {
        if (option) {
            option.addEventListener('click', () => {
                finalPokemon = option.value;
                fetchPokemonData(finalPokemon);
                pokemonSelector.style.display = 'none';
                optionsButton.textContent = option.textContent;
                optionsClicked = false;
            });
        }
    });
};

const init = () => {
    finalPokemon = optionsButton.value || 'mewtwo';
    fetchPokemonData(finalPokemon);

    handleExtraInfoToggle();
    handleOptionsChange();
    handleOpenOptions();
    handleChosingPokemon();
};

document.addEventListener('DOMContentLoaded', init);
