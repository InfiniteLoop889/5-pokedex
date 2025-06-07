let offset = 0;
let limit = 8;

async function init() {
  const BASE_URL = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`;
  getData(BASE_URL);
  createLoadMoreButton();
}

async function getData(url) {
  try {
    let response = await fetch(url);
    const responseToJson = await response.json();
    const dataArray = responseToJson.results;
    const detailedDataArray = [];

    for (const pokemon of dataArray) {
      const detailedData = await fetchPokemonDetails(pokemon.url);
      detailedDataArray.push(detailedData);
    }

    // console.log(dataArray);
    // console.log(detailedDataArray);

    displayData(detailedDataArray);
  } catch (error) {
    console.error(error);
  }
}

// async function getData(url) {
//   try {
//     let response = await fetch(url);
//     const responseToJson = await response.json();
//     const dataArray = responseToJson.results;

//     // Parallel fetch for Pokémon details
//     const detailedDataArray = await Promise.all(dataArray.map((pokemon) => fetchPokemonDetails(pokemon.url)));

//     displayData(detailedDataArray);
//   } catch (error) {
//     console.error(error);
//   }
// }

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
    // Add click event listener to open overlay
    pokemonCard.addEventListener("click", () => {
      openOverlay(pokemon, detailedDataArray);
    });

    gridWrapperRef.appendChild(pokemonCard);
  });
}

function openOverlay(pokemon, detailedDataArray) {
  const overlay = document.createElement("div");

  overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-current/50", "flex", "justify-center", "items-center", "z-50");
  overlay.innerHTML = createOverlayTemplate(pokemon);
  document.body.appendChild(overlay);

  addOverlayEventListeners(overlay, pokemon, detailedDataArray);
}

function addOverlayEventListeners(overlay, pokemon, detailedDataArray) {
  const currentIndex = pokemon.id - 1;

  // Close the overlay with the close button
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
  });

  // Close the overlay when clicking outside the card
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  // Navigate to the previous Pokémon
  document.getElementById("prev-button").addEventListener("click", () => {
    const prevIndex = (currentIndex - 1 + detailedDataArray.length) % detailedDataArray.length;
    document.body.removeChild(overlay);
    openOverlay(detailedDataArray[prevIndex], detailedDataArray);
  });

  // Navigate to the next Pokémon
  document.getElementById("next-button").addEventListener("click", () => {
    const nextIndex = (currentIndex + 1) % detailedDataArray.length;
    document.body.removeChild(overlay);
    openOverlay(detailedDataArray[nextIndex], detailedDataArray);
  });
}

function createLoadMoreButton() {
  const buttonWrapper = document.getElementById("button-wrapper");
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
    await getData(BASE_URL);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  } catch (error) {
    console.error("Fehler beim Laden der Pokémon:", error);

    buttonWrapper.classList.remove("hidden");
    loadingButton.classList.add("hidden");
  }
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
