async function init() {
  const BASE_URL = "https://pokeapi.co/api/v2/pokemon/?offset=0&limit=36";
  getData(BASE_URL);
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
  const gripWrapperRef = document.getElementById("grid-wrapper");

  detailedDataArray.forEach((pokemon) => {
    gripWrapperRef.innerHTML += createPokemonCard(pokemon);
  });
}

function capitalizeFirstLetter(val) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}

document.addEventListener("DOMContentLoaded", () => {
  init();
});
