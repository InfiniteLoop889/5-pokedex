// ------------------------------- Global variables -------------------------------

let offset = 0;
let limit = 24;
const allRenderedPokemonArr = [];
let currentSearchState = {
  isFiltered: false,
  filteredList: [],
  searchString: "",
};

// ------------------------------- Fetch and display functions -------------------------------

async function fetchPokemonData(url) {
  try {
    let response = await fetch(url);
    let data = await response.json();
    return data.results;
  } catch (error) {
    console.error(error);
  }
}

async function createPokemonArray(dataArray, skipHandleSearch = true) {
  const detailedDataArray = [];

  for (const pokemon of dataArray) {
    const detailedData = await fetchPokemonDetails(pokemon.url);
    detailedDataArray.push(detailedData);
    if (skipHandleSearch) {
      allRenderedPokemonArr.push(detailedData);
    }
  }

  return detailedDataArray;
}

async function fetchPokemonDetails(url) {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function displayData(detailedDataArray, clearWrapper = false) {
  const gridWrapperRef = document.getElementById("grid-wrapper");

  if (clearWrapper) {
    gridWrapperRef.innerHTML = "";
  }

  detailedDataArray.forEach((pokemon) => {
    const pokemonCard = document.createElement("div");

    pokemonCard.innerHTML = createPokemonCard(pokemon);

    pokemonCard.addEventListener("click", () => {
      openOverlay(pokemon, allRenderedPokemonArr);
    });

    gridWrapperRef.appendChild(pokemonCard);
  });
}

// ------------------------------- Load more button functions -------------------------------

function addEventToLoadMoreButton() {
  const buttonWrapper = document.getElementById("button-wrapper");
  buttonWrapper.classList.remove("hidden");
  buttonWrapper.addEventListener("click", loadMorePokemon);
}

async function loadMorePokemon() {
  const buttonWrapper = document.getElementById("button-wrapper");
  const loadingButton = document.getElementById("loading-button");

  buttonWrapper.classList.add("hidden");
  loadingButton.classList.remove("hidden");

  try {
    offset += limit;
    const baseUrl = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const rawPokemonData = await fetchPokemonData(baseUrl);
    const detailedPokemonData = await createPokemonArray(rawPokemonData, true);
    displayData(detailedPokemonData, false);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  }
}

// ------------------------------- Overlay functions -------------------------------

async function openOverlay(pokemon, allRenderedPokemonArr) {
  const overlay = document.createElement("div");
  const listToUse = currentSearchState.isFiltered ? currentSearchState.filteredList : allRenderedPokemonArr;

  overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-current/50", "flex", "justify-center", "items-center", "z-50");
  overlay.innerHTML = await createOverlayTemplate(pokemon, listToUse);
  document.body.appendChild(overlay);
  document.body.classList.add("overflow-hidden");

  addOverlayEventListeners(overlay, pokemon, listToUse);
}

function addOverlayEventListeners(overlay, pokemon, listToUse) {
  const currentIndex = listToUse.findIndex((p) => p.id === pokemon.id);

  addCloseButtonOverlayListener(overlay);
  addCloseOverlayListener(overlay);
  addPrevButtonListener(overlay, currentIndex, listToUse);
  addNextButtonListener(overlay, currentIndex, listToUse);
  addTabButtonListener();
}

function addCloseButtonOverlayListener(overlay) {
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
    document.body.classList.remove("overflow-hidden");
  });
}

function addCloseOverlayListener(overlay) {
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
      document.body.classList.remove("overflow-hidden");
    }
  });
}

function addPrevButtonListener(overlay, currentIndex, listToUse) {
  document.getElementById("prev-button").addEventListener("click", () => {
    const prevIndex = (currentIndex - 1 + listToUse.length) % listToUse.length;
    document.body.removeChild(overlay);
    openOverlay(listToUse[prevIndex], listToUse);
  });
}

function addNextButtonListener(overlay, currentIndex, listToUse) {
  document.getElementById("next-button").addEventListener("click", () => {
    console.log(listToUse);
    const nextIndex = (currentIndex + 1) % listToUse.length;
    document.body.removeChild(overlay);
    openOverlay(listToUse[nextIndex], listToUse);
  });
}

function addTabButtonListener() {
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("tab-button")) {
      const tab = event.target.dataset.tab;
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.add("border-transparent");
      });
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.add("hidden");
      });
      event.target.classList.remove("border-transparent");
      document.getElementById(tab).classList.remove("hidden");
    }
  });
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

function createPokemonCard(pokemon) {
  const types = pokemon.types.map((typeObj) => typeObj.type.name);
  return createPokemonTemplate(pokemon, types);
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
  let strengths = new Set();
  let weaknesses = new Set();

  types.forEach((type) => {
    const typeInfo = typeChart[type];
    if (typeInfo) {
      typeInfo.strongAgainst.forEach((strong) => strengths.add(strong));
      typeInfo.weakAgainst.forEach((weak) => weaknesses.add(weak));
    }
  });

  return createTypesTemplate(strengths, weaknesses, types);
}

async function loadEvolutions(pokemon) {
  const speciesResponse = await fetch(pokemon.species.url);
  const speciesToJson = await speciesResponse.json();
  const evoResponse = await fetch(speciesToJson.evolution_chain.url);
  const evoToJson = await evoResponse.json();

  return evoToJson.chain;
}

async function showPokemon(pokemon, allRenderedPokemonArr) {
  const evolutionChain = await loadEvolutions(pokemon);
  const evolutionTabHtml = createEvolutionsTab(evolutionChain, allRenderedPokemonArr);

  return evolutionTabHtml;
}

function getEvolutionStages(evolutionChain, allRenderedPokemonArr) {
  const stages = [];

  const base = evolutionChain.species.name;
  const basePokemon = findPokemonByName(base, allRenderedPokemonArr);
  if (basePokemon) {
    stages.push({
      pokemon: basePokemon,
      needsArrow: false,
    });
  }

  evolutionChain.evolves_to.forEach((stage1, index1) => {
    const stage1Pokemon = findPokemonByName(stage1.species.name, allRenderedPokemonArr);
    if (stage1Pokemon) {
      stages.push({
        pokemon: stage1Pokemon,
        needsArrow: index1 > 0 || basePokemon,
      });

      stage1.evolves_to.forEach((stage2, index2) => {
        const stage2Pokemon = findPokemonByName(stage2.species.name, allRenderedPokemonArr);
        if (stage2Pokemon) {
          stages.push({
            pokemon: stage2Pokemon,
            needsArrow: index2 > 0 || stage1Pokemon,
          });
        }
      });
    }
  });

  return stages;
}

function createEvolutionsTab(evolutionChain, allRenderedPokemonArr) {
  const stages = getEvolutionStages(evolutionChain, allRenderedPokemonArr);

  const evolutionHtml = stages
    .map((stage) => {
      const elements = [];
      if (stage.needsArrow) {
        elements.push(createEvolutionArrowTemplate());
      }
      elements.push(createEvolutionTemplate(stage.pokemon));
      return elements.join("");
    })
    .join("");

  return evolutionHtml;
}

// ------------------------------- Other help functions -------------------------------

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

function findPokemonByName(name, allRenderedPokemonArr) {
  return allRenderedPokemonArr.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

// ------------------------------- init functions -------------------------------

async function init() {
  const baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const dataArray = await fetchPokemonData(baseUrl);
  const pokemonData = await createPokemonArray(dataArray, true);
  displayData(pokemonData, true);
  addEventToLoadMoreButton();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  initSearch();
});
