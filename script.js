const state = {
  offset: 0,
  limit: 24,
  allPokemon: [],
  allPokemonNames: [],
  filteredPokemon: [],
  evolutions: [],
  isFiltered: false,
};

async function fetchPokemonUrls(url) {
  try {
    let response = await fetch(url);
    let responseToJson = await response.json();
    await fetchDetailedPokemonData(responseToJson.results);
  } catch (error) {
    console.error(error);
  }
}

async function fetchDetailedPokemonData(pokemonUrls) {
  let newPokemonarr = [];

  for (const element of pokemonUrls) {
    try {
      let response = await fetch(element.url);
      let responseToJson = await response.json();
      newPokemonarr.push(responseToJson);
      state.allPokemon.push(responseToJson);
    } catch (error) {
      console.log(error);
    }
  }

  renderPokemon(newPokemonarr);
}

function renderPokemon(newPokemons, targetGridId = "grid-wrapper") {
  const gridWrapperRef = document.getElementById(targetGridId);
  let pokemonHtml = "";

  newPokemons.forEach((pokemon) => {
    const types = pokemon.types.map((type) => type.type.name);
    pokemonHtml += createPokemonTemplate(pokemon, types);
  });

  gridWrapperRef.innerHTML += pokemonHtml;

  if (targetGridId === "grid-wrapper") {
    hideLoadingButton();
    showLoadButton();
  }
}

function getTypeElements(types) {
  let typeHtml = "";

  for (let type of types) {
    const backgroundColor = colours[type];
    const textColor = getTextColor(backgroundColor);
    typeHtml += createTypeElements(type, backgroundColor, textColor);
  }

  return typeHtml;
}

function loadMorePokemon() {
  state.offset += state.limit;
  const baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.offset}`;
  hideLoadButton();
  showLoadingButton();
  fetchPokemonUrls(baseUrl);
}

async function renderSelectedPokemon(pokemonId) {
  const overlay = document.getElementById("overlay");
  let pokemon = state.allPokemon.find((pokemon) => pokemon.id === pokemonId);

  if (!pokemon) {
    pokemon = state.filteredPokemon.find((pokemon) => pokemon.id === pokemonId);
  }

  const types = pokemon.types.map((typeObj) => typeObj.type.name);
  overlay.innerHTML = createOverlayTemplate(pokemon, types);
  addOverlayListeners();
  openOverlay();
}

function addOverlayListeners() {
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabPanels = document.querySelectorAll(".tab-panel");

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", (event) => {
      tabButtons.forEach((btn) => {
        btn.classList.add("border-transparent");
      });
      event.currentTarget.classList.remove("border-transparent");
      tabPanels.forEach((panel) => panel.classList.add("hidden"));
      document.getElementById(event.currentTarget.dataset.tab).classList.remove("hidden");
    });
  });
}

function openOverlay() {
  document.getElementById("overlay").classList.remove("hidden");
  document.getElementById("overlay").classList.add("fixed");
  document.body.classList.add("overflow-hidden");
}

function closeOverlay() {
  document.getElementById("overlay").classList.add("hidden");
  document.getElementById("overlay").classList.remove("fixed");
  document.body.classList.remove("overflow-hidden");
}

function prevPokemonBtn(pokemonId) {
  let navArray = state.allPokemon;

  if (state.isFiltered) {
    navArray = state.filteredPokemon;
  }

  const currentIndex = navArray.findIndex((pokemon) => pokemon.id === pokemonId);
  const prevIndex = (currentIndex - 1 + navArray.length) % navArray.length;
  const prevPokemonId = navArray[prevIndex].id;
  renderSelectedPokemon(prevPokemonId);
}

function nextPokemonBtn(pokemonId) {
  let navArray = state.allPokemon;

  if (state.isFiltered) {
    navArray = state.filteredPokemon;
  }

  const currentIndex = navArray.findIndex((pokemon) => pokemon.id === pokemonId);
  const nextIndex = (currentIndex + 1) % navArray.length;
  const nextPokemonId = navArray[nextIndex].id;
  renderSelectedPokemon(nextPokemonId);
}

function onclickProtection(event) {
  event.stopPropagation();
}

function processStats(stats) {
  return stats.map((stat) => ({
    name: capitalizeFirstLetter(stat.stat.name),
    value: stat.base_stat,
    width: Math.min(stat.base_stat, 150) / 1.5,
  }));
}

function createStatsTab(stats) {
  const processedStats = processStats(stats);
  return processedStats.map((stat) => createStatsTemplate(stat)).join("");
}

function createTypesTab(types) {
  let strengths = [];
  let weaknesses = [];

  types.forEach((type) => {
    const typeInfo = typeChart[type];
    if (typeInfo) {
      typeInfo.strongAgainst.forEach((strong) => {
        if (!strengths.includes(strong)) strengths.push(strong);
      });
      typeInfo.weakAgainst.forEach((weak) => {
        if (!weaknesses.includes(weak)) weaknesses.push(weak);
      });
    }
  });

  return createTypesTemplate(strengths, weaknesses, types);
}

function getEvoStages(evoStages) {
  const evoNames = [evoStages.species.name];

  if (evoStages.evolves_to && evoStages.evolves_to.length > 0) {
    evoStages.evolves_to.forEach((nextStage) => {
      evoNames.push(...getEvoStages(nextStage));
    });
  }

  return evoNames;
}

async function getEvolutionChain(pokemonId) {
  let pokemon = state.allPokemon.find((pokemon) => pokemon.id === pokemonId);

  if (!pokemon) {
    pokemon = state.filteredPokemon.find((pokemon) => pokemon.id === pokemonId);
  }

  try {
    const speciesResponse = await fetch(pokemon.species.url);
    const speciesToJson = await speciesResponse.json();
    const evoChainUrl = speciesToJson.evolution_chain.url;
    const evoChainResponse = await fetch(evoChainUrl);
    const evoChainToJson = await evoChainResponse.json();

    return getEvoStages(evoChainToJson.chain);
  } catch (error) {
    console.log(error);
  }
}

async function getPokemonByName(name) {
  let pokemon = state.allPokemon.find((pokemon) => pokemon.name === name);

  if (!pokemon) {
    try {
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
      pokemon = await response.json();
    } catch (error) {
      console.log(error);
    }
  }

  return pokemon;
}

function buildEvolutionsHtml(evoNames, evolutions) {
  let htmlString = "";

  for (let i = 0; i < evoNames.length; i++) {
    let pokemon = evolutions[i];
    htmlString += createEvolutionTemplate(pokemon);
    if (i < evoNames.length - 1) {
      htmlString += createEvolutionArrowTemplate();
    }
  }

  return htmlString;
}

async function showEvolutionsTab(pokemonId) {
  showEvoLoadingSpinner();

  const evoNames = await getEvolutionChain(pokemonId);
  const evolutionsRef = document.getElementById("evolutions-wrapper");
  state.evolutions = [];

  for (let name of evoNames) {
    let pokemon = await getPokemonByName(name);
    state.evolutions.push(pokemon);
  }

  evolutionsRef.innerHTML = buildEvolutionsHtml(evoNames, state.evolutions);

  hideEvoLoadingSpinner();
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function getBackgroundColor(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const backgroundColor = colours[primaryType] || "#777";

  return backgroundColor;
}

function getTextColor(backgroundColor) {
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  return brightness > 163 ? "dark:text-gray-800" : "text-white";
}

async function init() {
  showMainLoadingSpinner();
  const baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.offset}`;
  await fetchPokemonUrls(baseUrl);
  hideMainLoadingSpinner();
}

document.addEventListener("DOMContentLoaded", async () => {
  await init();
  await initSearch();
});
