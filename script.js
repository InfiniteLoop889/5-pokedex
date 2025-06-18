const state = {
  offset: 0,
  limit: 3,
  allPokemon: [],
  filteredPokemon: [],
  isFiltered: false,
};

async function fetchPokemonUrls(url) {
  let response = await fetch(url);
  let responseToJson = await response.json();
  await fetchDetailedPokemonData(responseToJson.results);
}

async function fetchDetailedPokemonData(pokemonUrls) {
  let newPokemonarr = [];
  for (const element of pokemonUrls) {
    let response = await fetch(element.url);
    let responseToJson = await response.json();
    newPokemonarr.push(responseToJson);
    state.allPokemon.push(responseToJson);
  }
  renderPokemon(newPokemonarr);
}

function renderPokemon(newPokemons) {
  const gridWrapperRef = document.getElementById("grid-wrapper");
  let pokemonHtml = "";

  newPokemons.forEach((pokemon) => {
    const types = pokemon.types.map((type) => type.type.name);
    pokemonHtml += createPokemonTemplate(pokemon, types);
  });

  gridWrapperRef.innerHTML += pokemonHtml;
  hideLoadingButton();
  showLoadButton();
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

function renderSelectedPokemon(pokemonId) {
  document.getElementById("overlay").innerText = pokemonId;
  createOverlayTemplate(pokemonId);
  openOverlay();
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

function onclickProtection(event) {
  event.stopPropagation();
}

function showLoadButton() {
  document.getElementById("button-wrapper").classList.remove("hidden");
}

function hideLoadButton() {
  document.getElementById("button-wrapper").classList.add("hidden");
}

function showLoadingButton() {
  document.getElementById("loading-button").classList.remove("hidden");
}

function hideLoadingButton() {
  document.getElementById("loading-button").classList.add("hidden");
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

// ----------------------------------------------------------------------------------

async function init() {
  const baseUrl = `https://pokeapi.co/api/v2/pokemon?limit=${state.limit}&offset=${state.offset}`;
  await fetchPokemonUrls(baseUrl);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
