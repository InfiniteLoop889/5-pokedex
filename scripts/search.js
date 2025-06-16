async function fetchAllPokemon() {
  try {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

function addSearchBarListener(pokemonList, searchInput) {
  const buttonWrapper = document.getElementById("button-wrapper");
  const gridWrapper = document.getElementById("grid-wrapper");

  searchInput.addEventListener("input", async function (event) {
    const searchString = event.target.value;

    if (searchString.length >= 3) {
      await handleSearch(pokemonList, buttonWrapper, gridWrapper, searchString);
    } else if (searchString.length === 0) {
      await resetToOriginalList(buttonWrapper);
    }
  });
}

async function handleSearch(pokemonList, buttonWrapper, gridWrapper, searchString) {
  const filteredPokemonArray = pokemonList.filter((pokemon) => pokemon.name.includes(searchString.toLowerCase()));
  buttonWrapper.classList.add("hidden");

  const pokemonData = await createPokemonArray(filteredPokemonArray, false);
  displayData(pokemonData, true);
}

async function resetToOriginalList(buttonWrapper) {
  displayData(allRenderedPokemonArr, true);
  buttonWrapper.classList.remove("hidden");
}

async function initSearch() {
  const pokemonList = await fetchAllPokemon();
  const searchInputDesktop = document.getElementById("search-navbar-desktop");
  const searchInputMobile = document.getElementById("search-navbar-mobile");

  searchInputDesktop.value = "";
  searchInputMobile.value = "";

  addSearchBarListener(pokemonList, searchInputDesktop);
  addSearchBarListener(pokemonList, searchInputMobile);
}
