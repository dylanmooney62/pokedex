// URLS
const pokdexURL = 'https://cryptic-headland-94862.herokuapp.com/http://pokeapi.co/api/v1/pokedex';
let pokemonURL = 'https://cryptic-headland-94862.herokuapp.com/http://pokeapi.co/api/v2/pokemon/';


// INTERFACES
const pokemonList = document.querySelector('.pokemon-list'),
  searchBar = document.querySelector('#search'),
  loader = document.querySelector('.ui__loader'),
  pokemonUI = document.querySelector('.pokemon-ui'),
  backButton = document.querySelector('.interface-button--left');


// POKEMON DETAILS
const pokemonName = document.querySelector('.pokemon__name'),
  pokemonNumber = document.querySelector('.pokemon__dex-number'),
  pokemonImage = document.querySelector('.pokemon__image'),
  pokemonHeight = document.querySelector('.pokemon__height'),
  pokemonWeight = document.querySelector('.pokemon__weight'),
  pokemonAbility = document.querySelector('.pokemon__ability'),
  pokemonType1 = document.querySelector('.pokemon__type-1'),
  pokemonType2 = document.querySelector('.pokemon__type-2');

// Event Listeners
searchBar.addEventListener('keyup', search);
pokemonList.addEventListener('click', getPokemondData);
backButton.addEventListener('click', displayPokemonList);

// INIT
getPokedexData(pokdexURL);


// POKEMON LIST FUNCTIONALITY

function search() {
  const allPokemon = document.querySelectorAll('.pokemon-list__item');
  allPokemon.forEach(pokemon => {
    if (pokemon.textContent.toLowerCase().includes(searchBar.value.toLowerCase()) || searchBar.value == ' ') {
      pokemon.style.display = 'flex';
    } else {
      pokemon.style.display = 'none';
    }
  });
}

function getPokedexData(url) {
  fetch(url)
    .then(result => {
      return result.json();
    })
    .then(data => {
      createPokedex(data);
    })
    .catch(error => {
      console.log('did not get the data boss');
    });
}

function createPokedex(data) {
  let pokedex = [];
  const pokemon = data.objects[0].pokemon;

  pokemon.forEach(pokemon => {
    pokedex.push({
      name: pokemon.name.capitalize(),
      id: pokemon.resource_uri.slice(15).replace('/', '')
    })
  });

  const sortedPokedex = sortPokedex(pokedex);
  buildPokemonList(sortedPokedex);
}

function sortPokedex(pokedex) {
  const sortedPokedex = pokedex.sort(function (a, b) {
    return a.id - b.id;
  })
  return sortedPokedex;
}

function buildPokemonList(pokedex) {
  pokedex.forEach(pokemon => {
    const li = document.createElement('li');
    const name = document.createElement('span');
    const number = document.createElement('span');

    li.className = 'pokemon-list__item';
    li.id = pokemon.id;
    name.className = 'pokemon-list__name';
    number.className = 'pokemon-list__number';

    name.appendChild(document.createTextNode(pokemon.name));
    number.appendChild(document.createTextNode(formatID(pokemon.id)));

    li.appendChild(number);
    li.appendChild(name);
    pokemonList.appendChild(li);
  });

  displayPokemonList();
}

function displayPokemonList() {
  displayLoader();
  searchBar.style.display = 'block';
  pokemonList.style.display = 'block';
  hideLoader();
}

// POKEMON FUNCTIONALITY

function getPokemondData(e) {
  if (e.target.className.includes('pokemon-list__')) {
    const id = e.target.parentNode.id;
    displayLoader();
    fetch(`${pokemonURL}${id}`)
      .then(result => {
        return result.json();
      })
      .then(data => {
        console.log(data);
        displayPokemon(data);
      })
      .catch(error => {
        console.log('A problem has occured');
      });
  }
}

function displayPokemon(pokemon) {
  // UPDATE UI
  pokemonImage.src = pokemon.sprites.front_default;
  pokemonName.textContent = pokemon.name.capitalize();
  pokemonNumber.textContent = formatID(pokemon.id);
  pokemonHeight.textContent = formatHeight(pokemon.height);
  pokemonWeight.textContent = formatWeight(pokemon.weight);
  // SELECTS LAST ABILITY WHICH IS THE DEFAULT ABILITY
  pokemonAbility.textContent = pokemon.abilities[pokemon.abilities.length - 1].ability.name.capitalize();

  formatTypes(pokemon.types);

  //  Display UI
  hideLoader();
  pokemonUI.style.display = 'flex';
}



// HELPER FUNCTIONS
String.prototype.capitalize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
}

function formatID(id) {
  if (id < 10) {
    return `#00${id}`;
  } else if (pokemon.id < 100) {
    return `#0${id}`;
  } else {
    return `#${id}`;
  }
}

function formatHeight(height) {
  return height < 10 ? `0.${height}m` : `${height}m`;
}

function formatWeight(weight) {
  return weight < 10 ? `0.${weight}lbs` : `${weight}lbs`;
}

function formatTypes(types) {
  // GET TYPES
  const type1 = types[types.length - 1].type.name;
  pokemonType1.textContent = type1;
  pokemonType1.className = `pokemon__type pokemon__type--${type1}`;
  if (types.length > 1) {
    const type2 = types[0].type.name;
    pokemonType2.style.display = 'block'
    pokemonType2.textContent = type2;
    pokemonType2.className = `pokemon__type pokemon__type--${type2}`;
  } else {
    pokemonType2.style.display = 'none';
  }
}

function displayLoader() {
  pokemonUI.style.display = 'none';
  pokemonList.style.display = 'none';
  searchBar.style.display = 'none';
  loader.style.display = 'block'
}

function hideLoader() {
  loader.style.display = 'none';
}