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
      openOverlay(pokemon);
    });

    gridWrapperRef.appendChild(pokemonCard);
  });
}

function openOverlay(pokemon) {
  const overlay = document.createElement("div");
  overlay.classList.add("fixed", "top-0", "left-0", "w-full", "h-full", "bg-current/50", "flex", "justify-center", "items-center", "z-50");

  overlay.innerHTML = createOverlayTemplate(pokemon);

  document.body.appendChild(overlay);

  // Add event listener to close the overlay when clicking outside the content
  overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
      document.body.removeChild(overlay);
    }
  });

  // Add event listener to close the overlay via the close button
  document.getElementById("close-overlay").addEventListener("click", () => {
    document.body.removeChild(overlay);
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
