// ------------------------------- Global variables -------------------------------

let offset = 0;
let limit = 8;

const colours = {
  normal: "#A8A77A",
  fire: "#EE8130",
  water: "#6390F0",
  electric: "#F7D02C",
  grass: "#7AC74C",
  ice: "#96D9D6",
  fighting: "#C22E28",
  poison: "#A33EA1",
  ground: "#E2BF65",
  flying: "#A98FF3",
  psychic: "#F95587",
  bug: "#A6B91A",
  rock: "#B6A136",
  ghost: "#735797",
  dragon: "#6F35FC",
  dark: "#705746",
  steel: "#B7B7CE",
  fairy: "#D685AD",
};

// ------------------------------- Fetch and display functions -------------------------------

async function fetchData(url) {
  try {
    let response = await fetch(url);
    const responseToJson = await response.json();
    return responseToJson.results; // Rückgabe der Rohdaten
  } catch (error) {
    console.error(error);
  }
}

async function createPokemonArray(dataArray) {
  const detailedDataArray = [];

  for (const pokemon of dataArray) {
    const detailedData = await fetchPokemonDetails(pokemon.url);
    detailedDataArray.push(detailedData);
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
      openOverlay(pokemon, detailedDataArray);
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
    const rawPokemonData = await fetchData(BASE_URL);
    const detailedPokemonData = await createPokemonArray(rawPokemonData);
    displayData(detailedPokemonData);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  }
}

// ------------------------------- Overlay functions -------------------------------

async function openOverlay(pokemon, detailedDataArray) {
  const overlay = document.createElement("div");

  overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-current/50", "flex", "justify-center", "items-center", "z-50");
  overlay.innerHTML = await createOverlayTemplate(pokemon); // await hinzufügen
  document.body.appendChild(overlay);

  addOverlayEventListeners(overlay, pokemon, detailedDataArray);
}

function addOverlayEventListeners(overlay, pokemon, detailedDataArray) {
  const currentIndex = pokemon.id - 1;

  addCloseButtonOverlayListener(overlay);
  addCloseOverlayListener(overlay);
  addPrevButtonListener(overlay, currentIndex, detailedDataArray);
  addNextButtonListener(overlay, currentIndex, detailedDataArray);
  addTabButtonListener();
}

function addCloseButtonOverlayListener(overlay) {
  // Close the overlay with the close button
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });
}

function addCloseOverlayListener(overlay) {
  // Close the overlay when clicking outside the pokemon card
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  });
}

function addPrevButtonListener(overlay, currentIndex, detailedDataArray) {
  document.getElementById("prev-button").addEventListener("click", () => {
    const prevIndex = (currentIndex - 1 + detailedDataArray.length) % detailedDataArray.length;
    document.body.removeChild(overlay);
    openOverlay(detailedDataArray[prevIndex], detailedDataArray);
  });
}

function addNextButtonListener(overlay, currentIndex, detailedDataArray) {
  document.getElementById("next-button").addEventListener("click", () => {
    const nextIndex = (currentIndex + 1) % detailedDataArray.length;
    document.body.removeChild(overlay);
    openOverlay(detailedDataArray[nextIndex], detailedDataArray);
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

// ------------------------------- init() function -------------------------------

async function init() {
  const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  const dataArray = await fetchData(BASE_URL);
  const pokemonData = await createPokemonArray(dataArray); // Verarbeitung der Daten
  displayData(pokemonData);
  addEventToLoadMoreButton();
}

document.addEventListener("DOMContentLoaded", () => {
  init();
  initSearch();
});
