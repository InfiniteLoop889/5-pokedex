async function getAllPokemon() {
  try {
    // let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100&offset=0");
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

function addSearchBarListener(searchInput, pokemonList) {
  searchInput.addEventListener("input", async function (event) {
    const searchString = event.target.value;

    if (searchString.length >= 3) {
      const filteredPokemonArray = pokemonList.filter((pokemon) => pokemon.name.includes(searchString.toLowerCase()));
      const buttonWrapper = document.getElementById("button-wrapper");
      buttonWrapper.classList.add("hidden");

      const gridWrapper = document.getElementById("grid-wrapper");
      gridWrapper.innerHTML = "";

      const pokemonData = await createPokemonArray(filteredPokemonArray);
      displayData(pokemonData);
    } else if (searchString.length === 0) {
      // Reset offset and limit to their original values
      offset = 0;
      limit = 32;

      const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
      const gridWrapper = document.getElementById("grid-wrapper");
      gridWrapper.innerHTML = "";

      const originalPokemonList = await fetchData(BASE_URL);
      const pokemonData = await createPokemonArray(originalPokemonList);
      displayData(pokemonData);

      const buttonWrapper = document.getElementById("button-wrapper");
      buttonWrapper.classList.remove("hidden");
    }
  });
}

async function initSearch() {
  const pokemonList = await getAllPokemon();
  const searchInput = document.getElementById("search-navbar");

  searchInput.value = "";

  addSearchBarListener(searchInput, pokemonList);
}
