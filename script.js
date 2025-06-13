// ------------------------------- Global variables -------------------------------

let offset = 0;
let limit = 32;
const allRenderedPokemonArr = [];

// ------------------------------- Fetch and display functions -------------------------------

async function fetchPokemonData(url) {
  try {
    let response = await fetch(url);
    const responseToJson = await response.json();
    return responseToJson.results;
  } catch (error) {
    console.error(error);
  }
}

async function createPokemonArray(dataArray) {
  const detailedDataArray = [];

  for (const pokemon of dataArray) {
    const detailedData = await fetchPokemonDetails(pokemon.url);
    detailedDataArray.push(detailedData);
    allRenderedPokemonArr.push(detailedData);
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

function displayData(detailedDataArray) {
  const gridWrapperRef = document.getElementById("grid-wrapper");

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
    const BASE_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
    const rawPokemonData = await fetchPokemonData(BASE_URL);
    const detailedPokemonData = await createPokemonArray(rawPokemonData);
    displayData(detailedPokemonData);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);
  }
}

// ------------------------------- Overlay functions -------------------------------

async function openOverlay(pokemon, allRenderedPokemonArr) {
  const overlay = document.createElement("div");

  overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-current/50", "flex", "justify-center", "items-center", "z-50");
  overlay.innerHTML = await createOverlayTemplate(pokemon, allRenderedPokemonArr);
  document.body.appendChild(overlay);
  document.body.classList.add("overflow-hidden");

  addOverlayEventListeners(overlay, pokemon, allRenderedPokemonArr);
}

function addOverlayEventListeners(overlay, pokemon, allRenderedPokemonArr) {
  const currentIndex = pokemon.id - 1;

  addCloseButtonOverlayListener(overlay);
  addCloseOverlayListener(overlay);
  addPrevButtonListener(overlay, currentIndex, allRenderedPokemonArr);
  addNextButtonListener(overlay, currentIndex, allRenderedPokemonArr);
  addTabButtonListener();
}

function addCloseButtonOverlayListener(overlay) {
  // Close the overlay with the close button
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
    document.body.classList.remove("overflow-hidden");
  });
}

function addCloseOverlayListener(overlay) {
  // Close the overlay when clicking outside the pokemon card
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
      document.body.classList.remove("overflow-hidden");
    }
  });
}

function addPrevButtonListener(overlay, currentIndex, allRenderedPokemonArr) {
  document.getElementById("prev-button").addEventListener("click", () => {
    const prevIndex = (currentIndex - 1 + allRenderedPokemonArr.length) % allRenderedPokemonArr.length;
    document.body.removeChild(overlay);
    openOverlay(allRenderedPokemonArr[prevIndex], allRenderedPokemonArr);
  });
}

function addNextButtonListener(overlay, currentIndex, allRenderedPokemonArr) {
  document.getElementById("next-button").addEventListener("click", () => {
    const nextIndex = (currentIndex + 1) % allRenderedPokemonArr.length;
    document.body.removeChild(overlay);
    openOverlay(allRenderedPokemonArr[nextIndex], allRenderedPokemonArr);
  });
}

function addTabButtonListener() {
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("tab-button")) {
      const tab = event.target.dataset.tab;

      // Alle Tabs und Inhalte zurücksetzen
      document.querySelectorAll(".tab-button").forEach((button) => {
        button.classList.add("border-transparent");
      });
      document.querySelectorAll(".tab-panel").forEach((panel) => {
        panel.classList.add("hidden");
      });

      // Aktiven Tab und Inhalt anzeigen
      event.target.classList.remove("border-transparent");
      document.getElementById(tab).classList.remove("hidden");
    }
  });
}

// ------------------------------- Helper functions -------------------------------

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

function getBackgroundColor(pokemon) {
  const primaryType = pokemon.types[0].type.name;
  const backgroundColor = colours[primaryType] || "#777";
  return backgroundColor;
}

function getTextColor(backgroundColor) {
  // Extracting RGB-Values
  const r = parseInt(backgroundColor.slice(1, 3), 16);
  const g = parseInt(backgroundColor.slice(3, 5), 16);
  const b = parseInt(backgroundColor.slice(5, 7), 16);

  // Calculate relative brightness (Luminance)
  const brightness = r * 0.299 + g * 0.587 + b * 0.114;

  return brightness > 163 ? "dark:text-gray-800" : "text-white";
}

function findPokemonByName(name, allRenderedPokemonArr) {
  return allRenderedPokemonArr.find((p) => p.name.toLowerCase() === name.toLowerCase());
}

// ------------------------------- init() function -------------------------------

async function init() {
  const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const dataArray = await fetchPokemonData(BASE_URL);
  const pokemonData = await createPokemonArray(dataArray);
  displayData(pokemonData);
  addEventToLoadMoreButton();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  initSearch();
});
