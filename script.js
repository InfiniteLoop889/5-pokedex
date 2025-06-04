let offset = 0;
let limit = 8;

async function init() {
  const BASE_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
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

async function fetchPokemonDetails(url) {
  try {
    let response = await fetch(url);
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function displayData(detailedDataArray) {
  const gridWrapperRef = document.getElementById("grid-wrapper");
  const fragment = document.createDocumentFragment(); // Fragment erstellen

  detailedDataArray.forEach((pokemon) => {
    const pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = createPokemonCard(pokemon);
    fragment.appendChild(pokemonCard); // Karten zum Fragment hinzufügen
  });

  gridWrapperRef.appendChild(fragment); // Fragment auf einmal anhängen
}

function createLoadMoreButton() {
  const buttonWrapper = document.getElementById("button-wrapper");
  buttonWrapper.addEventListener("click", loadMorePokemon);
}

async function loadMorePokemon() {
  offset += limit;
  const BASE_URL = `https://pokeapi.co/api/v2/pokemon/?offset=${offset}&limit=${limit}`;
  await getData(BASE_URL);
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
