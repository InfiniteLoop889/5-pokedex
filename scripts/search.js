async function fetchAllPokemon() {
  try {
    let response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=1000&offset=0");
    let data = await response.json();
    state.allPokemonNames = data.results;
  } catch (error) {
    console.error(error);
  }
}

function addSearchBarListener(searchInput) {
  const buttonWrapper = document.getElementById("button-wrapper");
  const gridWrapper = document.getElementById("grid-wrapper");
  const gridWrapperSearch = document.getElementById("grid-wrapper-search");
  let debounceTimeout = null;

  searchInput.addEventListener("input", function (event) {
    const searchString = event.target.value;

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    debounceTimeout = setTimeout(async () => {
      if (searchString.length >= 3) {
        showSearchLoadingSpinner();
        showSearchResults(buttonWrapper, gridWrapper);
        await handleSearch(searchString, gridWrapperSearch);
        hideSearchLoadingSpinner();
        state.isFiltered = true;
      } else if (searchString.length === 0) {
        hideSearchResults(buttonWrapper, gridWrapper, gridWrapperSearch);
        state.isFiltered = false;
      }
    }, 300);
  });
}

async function handleSearch(searchString, gridWrapperSearch) {
  gridWrapperSearch.innerHTML = "";
  state.filteredPokemon = [];

  const filteredPokemon = state.allPokemonNames.filter((p) => p.name.includes(searchString.toLowerCase()));

  for (let pokemonUrl of filteredPokemon) {
    try {
      let response = await fetch(pokemonUrl.url);
      let responseToJson = await response.json();
      renderPokemon([responseToJson], "grid-wrapper-search");
      state.filteredPokemon.push(responseToJson);
    } catch (error) {
      console.log(error);
    }
  }
}

function showSearchResults(buttonWrapper, gridWrapper) {
  buttonWrapper.classList.add("hidden");
  gridWrapper.classList.add("hidden");
}

function hideSearchResults(buttonWrapper, gridWrapper, gridWrapperSearch) {
  gridWrapper.classList.remove("hidden");
  buttonWrapper.classList.remove("hidden");
  gridWrapperSearch.classList.add("hidden");
}

async function initSearch() {
  const searchInputDesktop = document.getElementById("search-navbar-desktop");

  searchInputDesktop.value = "";
  await fetchAllPokemon();
  addSearchBarListener(searchInputDesktop);
}
