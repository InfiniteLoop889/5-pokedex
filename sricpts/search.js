async function getAllPokemon() {
  try {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    // let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10&offset=0");
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

function addSearchBarListener(searchInput, pokemonList) {
  const buttonWrapper = document.getElementById("button-wrapper");
  const gridWrapper = document.getElementById("grid-wrapper");

  searchInput.addEventListener("input", async function (event) {
    const searchString = event.target.value;

    if (searchString.length >= 3) {
      await handleSearch(gridWrapper, buttonWrapper, pokemonList, searchString);
    } else if (searchString.length === 0) {
      await resetToOriginalList(gridWrapper, buttonWrapper);
    }
  });
}

async function handleSearch(gridWrapper, buttonWrapper, pokemonList, searchString) {
  const filteredPokemonArray = pokemonList.filter((pokemon) => pokemon.name.includes(searchString.toLowerCase()));
  buttonWrapper.classList.add("hidden");
  gridWrapper.innerHTML = "";

  const pokemonData = await createPokemonArray(filteredPokemonArray);
  displayData(pokemonData);
}

// reset offset and limit to display initial content after deleting the search bar input
async function resetToOriginalList(gridWrapper, buttonWrapper) {
  offset = 0;
  limit = 32;

  const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  gridWrapper.innerHTML = "";

  const originalPokemonList = await fetchData(BASE_URL);
  const pokemonData = await createPokemonArray(originalPokemonList);
  displayData(pokemonData);

  buttonWrapper.classList.remove("hidden");
}

async function initSearch() {
  const pokemonList = await getAllPokemon();
  const searchInput = document.getElementById("search-navbar");

  searchInput.value = "";

  addSearchBarListener(searchInput, pokemonList);
}
